/********************************************************************
*
* Filename:     Quadtree.js
* Description:  A way of efficiently querying what nodes are where
*               AABB stands for Axis Aligned Bounding Box
*
*               qTree nodes have either links to other nodes, or are
*               buckets. Links to other nodes are [0],[1],[2],[3]
*               representing each corner of the space 0 = NW and the rest
*               go clockwise round.
*
*               This code has a dependency: pathways.boundingBox and pathways.vector2D
*               which are used together to provide the collision detection functionality.
*               
*               Alternative bounding box libs could be used, but they must support the following
*               methods: getCollidingQuadrants(), returning an array of true/false representing, in clockwise
*               order, nw to sw AND subdivide(), which returns 4 new instances of itself, split into quarters.
*   
********************************************************************/

function QuadTreeNode ( obj ){

    if(!obj.AABB){
        throw("Cannot create a qNode without bounding box data");
    }
    // we keep a record of this node's bounding box
    this.AABB = obj.AABB;

    // and we track the depth. It's possible we can use depth based limiting rather than resolution based limiting.
    this.depth = obj.depth + 1 || 0;

    // If there's data, then we put that data in the bucket.
    if(obj.data){

        this.bucket = [];
        this.bucket.push(obj.data);

    }else{
        // otherwise we create an empty bucket.
        this.bucket = [];

    }

    return this;

}

QuadTreeNode.prototype = {

    // We put a unique ID on each piece of data that goes in
    qTreeUID : 0,

    // The push method is a recursive function that pushes data down into the tree
    push : function( obj ){

        // If the data doesn't already have a qTreeUID, give it one. This is so that
        // when pulling the data back out, we don't return duplicate results
        if(!obj.data.qTreeUID){
            obj.data.qTreeUID = ++this.qTreeUID;
        }
        
        // check that there's been valid stuff passed to it..
        if(!obj.data && !obj.AABB && !obj.AABB.testForCollision){

            throw("Invalid data attempted to be pushed to quadtree");

        }else{
            // It's a Quad Tree. There are 4 Quads. We need to know which Quads are relevant to this data
            var matchingCorners = this.getMatchingCornersPush( obj.AABB ), index, isMatched = false;

            // engulfed is a special thing. It means that the bounding box of the data being pushed
            // is bigger than the Quad. It's "Engulfed" and we don't bother to subdivide any further.
            if(matchingCorners==='engulfed'){

                // we just copy a reference to the data into the bucket.
                if(!this.bucket){
                    
                    this.bucket = [];
                }
                this.bucket.push(obj.data);

                return this;

            }else{

                // At this point we either have no match, or a bunch of matches, 
                // (technically, quads that this data should be pushed down to)
                if(matchingCorners!=="no match"){

                    // A node can be a bucket or a leaf. If it's got a member this[0] it's probably a leaf.
                    if(!this[0]){

                        // If the half-width of this particular leaf is above 12, we allow further subdivision.
                        if(this.AABB.hw > 8){

                            // Thankfully the bounding box utils have a 'subdivide' method.
                            var subdivs = this.AABB.subdivide();

                            // And then we take these new bounding boxes and create new qNodes, passing the depth
                            this[0] = new QuadTreeNode({ AABB: subdivs.nw, depth : this.depth });
                            this[1] = new QuadTreeNode({ AABB: subdivs.ne, depth : this.depth });
                            this[2] = new QuadTreeNode({ AABB: subdivs.se, depth : this.depth });
                            this[3] = new QuadTreeNode({ AABB: subdivs.sw, depth : this.depth });

                            // And we get rid of the bucket, turning this qNode into a leaf.
                            delete this.bucket;


                        }else{
                            // we're already subdivided too far, so we bucketize this node
                            this.bucket.push(obj.data);
                            return this;

                        }

                    }

                    // so we've subdivided now, or were already subdivided. Time to push the data down...

                    // 4 corners...
                    index = 4;
                    // Super Efficient Loop Backwards
                    while(index--){
                        // If the data matches this corner...
                        if(matchingCorners[index]===true){
                            // push the data down (recursively invoking push again)
                            this[index].push({ data: obj.data, AABB: obj.AABB});
                        }
                    }

                }

            }

        }

        return this;

    },

    // query returns all data in a given area of space

    query : function ( obj, results, matches ){
        // an array to hold results
        if(!results){
            results = [];
        }
        // an array to hold unique qTreeUIDs
        if(!matches){
            matches = [];
        }

        if(this.bucket){
            // the end of the line, found a bucket, return it and back up we go
            return this.bucket;

        }else{

            // find which corners match..
            var matchingCorners = this.getMatchingCornersQuery( obj );

            // if there's a match...
            if(matchingCorners!=="no match"){
                
                
                // 4 corners...
                var index = 4;

                // which we loop through efficiently...
                while(index--){
                    // if we find a match...
                    if(matchingCorners[index]===true){
                        // we recursively invoke query on the child node
                        var data = this[index].query( obj, results, matches );

                        // if this is a bucket with data and qTreeUID, and we haven't already
                        // found this particular piece of data...
                        if(data[0] && data[0].qTreeUID && !matches[data[0].qTreeUID]){

                                // we mark that we've found it in 'matches'
                                matches[data[0].qTreeUID] = true;

                                // and we push the data into results. The results are 
                                results.push(data[0]);

                        }

                    }
                }
                // we return the final results here.
                return results;

            } else {

                return false;
            }

        }

    },

    getMatchingCornersPush : function(obj){
        // this just invokes the getCollidingQuadrants method of the bounding box.

        // It returns either an array of matching quadrants in teh form, [true],[false],[true],[false] etc
        // or 'no match' or 'engulfed'. Each element of the array is true or false, and go in the following order:
        // nw, ne, se, sw. 

        // 'no match' means that the object being pushed doesn't collide with any of the quads in this qNode
        // 'engulfed' means that the object being pushed is BIGGER and totally surrounds the entire qNode,
        // which means that this qNode should become a bucket rather than subdividing further.

        return this.AABB.getCollidingQuadrants(obj);

    },

    getMatchingCornersQuery : function(obj){
        // this invokes the same getCollidingQuadrants method, but we convert
        // an 'engulfed' signal into [true],[true],[true],[true]. 

        // This is because, as we get deeper into the tree, the size of a qNode may end up being 
        // smaller than the area being queried and, in fact, sit inside it completely.

        // When pushing we use this information to prevent further subdivision, but when querying
        // we want keep going down into the tree to find buckets, which 'engulfed' signals block.

        var matches = this.AABB.getCollidingQuadrants(obj);

        if(matches==="engulfed"){
            return [true, true, true, true];
        }else{
            return matches;
        }   

    }

};

module.exports.QuadTree = module.exports.QNode = QuadTreeNode;