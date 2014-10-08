/********************************************************************
*
* Filename:     Edge.js
* Description:  For creating and processing edges
*   
********************************************************************/

var BoundingBox = require('./vector-processing-and-bounding-box.js').BoundingBox;
var Vector2D = require('./vector-processing-and-bounding-box.js').Vector2D;


var Point = require('./point.js');
var Label = require('./label.js');

function Edge (start, finish){

    this.start = start;
    this.finish = finish;

    return this;

}

Edge.prototype = {

    draw : function( planetObj, scale ){

        if (!scale){
            scale = 1;
        }

        planetObj.path({
            points: [
                {
                    x : this.start.x * scale, 
                    y: this.start.y * scale
                }, 
                {
                    x : this.finish.x * scale, 
                    y: this.finish.y * scale
                }
            ]
        });
    }
};

function EdgeGroup (uid){

    this.children = [];
    this.length = 0;
    this.edges = []; // array of edges.
    this.mode = "none";
    this.uidCache = {};
    this.uid = uid;
    return this;

}

EdgeGroup.prototype = {

    complete : function(){


        var index = 0, parent, child, dotProduct, connectionTypes = {}, currentChild, modes = 0, x, y;
            // compare the source at, attributes for children[0] and children[1]. If they're the same, then it's the source 
            // _this's the matched point
        if ((!this.child[1]) || (this.compare(this.child[0].source, this.child[1].source)) ) {

            parent = "source";
            child = "target";


        }else{
            
            parent = "target";
            child = "source";

        }

        this.parent = this.child[0][parent];

        if (parent==="target" && (this.child[0].type==="directional" || this.child[0].label!=="" )){
                
                this.parent.meta = { 
                                        type : this.child[0].type, 
                                        label : this.child[0].label,
                                        labelGeometry : this.child[0].labelGeometry || new BoundingBox()
                                    };
                

        }

        while(index < this.child.length){

            this.children.push(this.child[index][child]);

            currentChild = this.children[this.children.length -1];

            //if (child==="target" && (this.child[index].type==="directional" || this.child[index].label!=="" )){
                
            currentChild.meta = { 
                                    type : (child==="target" ? this.child[index].type : "none"),
                                    label : this.child[index].label, // we take the label from the edge
                                    labelGeometry : this.child[index].labelGeometry || new BoundingBox()
                                };
                

            //}
            // what we're doing is figuring out what type of connection it is,
            // and also whether all the edges are of the same kind. 

            // This is 

            dotProduct = this.parent.point.compareDirection(this.child[index][child]);

            if (dotProduct===1){
                
                currentChild.mode = "heuristic";

            }else if (dotProduct===0){
                
                currentChild.mode = "intersecting";

            }else if (dotProduct===-1){

                x = Math.abs(this.parent.point.x - currentChild.point.x);
                y = Math.abs(this.parent.point.y - currentChild.point.y);

                x = (x * currentChild.point.vector.x);
                y = (y * currentChild.point.vector.y);

                if (x!==0 && (currentChild.point.x + x !== this.parent.point.x)){
                    
                    currentChild.mode = "inverse-cascade";

                }else if (y!== 0 && (currentChild.point.y + y !== this.parent.point.y)){

                    currentChild.mode = "inverse-cascade";

                }else{

                    currentChild.mode = "cascading";

                }

            }

            if (this.mode!==currentChild.mode){
                
                this.mode = currentChild.mode;
                modes++;

            }

            index++;

        }

        if (modes!==1){
            
            this.mode = "combined";
            index = 0;

            while(index < this.children.length){
                
                if (this.children[index].mode==="intersecting" && this.mode!=="ultimate-evil-edge-group-of-doom"){
                    
                    this.mode="combined-with-intersect";
                    

                }else if (this.children[index].mode==="inverse-cascade"){
                    
                    this.mode="ultimate-evil-edge-group-of-doom";
                }

                index++;

            }

        }

        // find out if we've got an edge group of uniform connection types

        delete this.child;
        
        return this;

    },
    compare : function(a, b){

        if (a.point.x===b.point.x){
            
            if (a.point.y===b.point.y){
                
                if (a.vector.x===b.vector.x){
                    
                    if (a.vector.y===b.vector.y){
                        
                        return true;

                    }

                }

            }

        }
        
        return false;           

    },

    addChild : function( source, sourceSide, target, targetSide, type, label, labelGeometry, uid){
        
        var _this = this;

        if (!this.uidCache[uid]){

            if (!this.child){
                
                this.child = [];
            }

            var getVectorAndPoint = function(node, direction){
            
                var vector = convertDirectionToVector( direction );
                var point = node.getConnectorPoint( vector );

                return {
                    
                    vector : vector,
                    point : point

                };
            };

            var s = getVectorAndPoint(source, sourceSide);
            var t = getVectorAndPoint(target, targetSide);

            this.child.push({
                    source : s,
                    target : t,
                    type : type,
                    label : label,
                    labelGeometry : labelGeometry

                });

            this.uidCache[uid] = true;
            
            this.length++;

        }

        return this;

    },

    checkForCollisions : function(AABB, candidates){
            
            var i = candidates.length, collision = false, collisions = [], result;
            while(i--){
                
                result = AABB.testForCollision(candidates[i].AABB);

                if (result){
                    
                    collisions.push(result);

                }

            }

            return collisions;

    },

    createEdges : function (){

        var _this = this;

        var createBoundingBox = function( ){
            
            /* This helper function creates a bounding box around the various points in the edge group */
            /* this bounding box helps filter down the list of nodes to do a collision detection test against */
            /* by querying the quad tree using this box */

            /* It's tucked away inside a closure */

            var minX, maxX, minY, maxY, index = 0, point = this.parent.point, vector = this.parent.point.vector; 


            minX = maxX = point.x;
            minY = maxY = point.y;

            maxX = Math.max(maxX, (point.x + (vector.x * 20)));
            maxY = Math.max(maxY, (point.y + (vector.y * 20)));
            minX = Math.min(minX, (point.x + (vector.x * 20)));
            minY = Math.min(minY, (point.y + (vector.y * 20)));

            while(index < this.length){

                point = this.children[index].point;
                vector = this.children[index].vector;
                
                // The points themselves...
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);

                maxX = Math.max(maxX, (point.x + (vector.x * 20)));
                maxY = Math.max(maxY, (point.y + (vector.y * 20)));
                minX = Math.min(minX, (point.x + (vector.x * 20)));
                minY = Math.min(minY, (point.y + (vector.y * 20)));

                index++;

            }

            return new BoundingBox( new Vector2D(minX, minY), new Vector2D(maxX - minX, maxY - minY) );

        };

        var resolveExtentPosition = function(position, vector){
            
            if (vector < 0){
                
                return 0;

            }else{
                
                return position;
            }

        };

        var resolveExtentSize = function(position, vector, size){
            
            if (vector < 0){
                
                return position;

            }else if (vector===0){
                
                return 1;

            }else{
                
                return size - position;
            }

        };

        var getNewExtentPosition = (function(){
            
            var resolvePosition = function( position, resolution, vector){
                
                    if (vector < 0){
                        
                        return position + resolution;

                    }else{
                        
                        return position;

                    }

            };

            return function( extentBox, collision, vector ){
                
                    var x, y;
                    
                    x = resolvePosition( extentBox.x, collision.x - (collision.hw * 2), (vector.x * -1) );
                    y = resolvePosition( extentBox.y, collision.y, vector.y );  

                    return new Vector2D(x, y);

            };

        }());

        var getNewExtentSize = (function(   ){
            
            var resolveSize = function( size, resolution, collisionSize, vector){
                
                    if (vector < 0){
                        
                        return size - resolution;

                    }else if (vector > 0){
                        
                        return resolution - collisionSize;

                    }else{
                        
                        return size;

                    }

            };

            return function( extentBox, collision, vector ){
                
                var x, y;

                x = resolveSize( (extentBox.hw * 2), collision.x, (collision.hw * 2), (vector.x * -1)); // we flip the horizontal vector because 
                                                                                                        // the collision result is inverted
                y = resolveSize( (extentBox.hh * 2), collision.y, (collision.hh * 2), vector.y  );

                return new Vector2D(x, y);

            };

        }());

        var extendConnectorToLimit = function ( point, candidates, aabb, scope ){
            
            var relative, extendBox, B = BoundingBox, V = Vector2D;

            var vector = point.vector;

            relative = {
                x : point.x - aabb.x,
                y : point.y - aabb.y
            };

            extentBox = new B ( new V( 
                                aabb.x + resolveExtentPosition(relative.x, vector.x),
                                aabb.y + resolveExtentPosition(relative.y, vector.y) 
                            ), 
                            new V( 
                                resolveExtentSize(relative.x, vector.x, (aabb.hw * 2)),
                                resolveExtentSize(relative.y, vector.y, (aabb.hh * 2)) 
                            )
                        );

            collisionResults = scope.checkForCollisions(extentBox, candidates);

                if (collisionResults.length > 0){
                    
                    j = 0;

                    var newPosition, newSize, candidateA = extentBox, candidateB;
                    
                    while(j < collisionResults.length){
                        
                            newPosition = getNewExtentPosition( extentBox, collisionResults[j], vector );
                            newSize = getNewExtentSize( extentBox, collisionResults[j], vector );

                            candidateB = new B( newPosition, newSize );
                            if ( ((candidateA.hh > candidateB.hh) && (candidateA.hw === candidateB.hw)) || ((candidateA.hw > candidateB.hw) && (candidateA.hh === candidateB.hh)) ){

                                candidateA = candidateB;

                            }
                            j++;
                    }
                    extentBox = candidateA;

                }

            return extentBox;

        };

        return function( spacialIndex ){
            
            // we've now got the edge groups. Go through each one, create a start and end point(s)
            var index, edgePoint, sharedPoint, sharedBox, vector, point, relative, extentBox, currentChild;

            var aabb = createBoundingBox.call(this);

            this.collisions = spacialIndex.query( aabb );

            j = this.collisions.length;

            this.potentialCollision = false;

            while(j--){
                
                if (this.collisions[j].AABB.testForCollision(aabb)){
                    
                    this.potentialCollision = true;

                }

            }

            index = 0;

            if (this.mode==="combined-with-intersect"){

                    var updatedStartPoint, cascadeVector;

                        index = 0;
                        while(index < this.length){

                            currentChild = this.children[index];
                            point = currentChild.point;
                            vector = point.vector;

                            cascadeVector = {
                                                x : this.parent.point.vector.x * -1, 
                                                y : this.parent.point.vector.y * -1
                                            };

                            if (vector.x!==cascadeVector.x && vector.y!==cascadeVector.y){
                                
                                updatedStartPoint = new Point({ 
                                                                    x : point.x + (vector.x * 20), 
                                                                        y : point.y + (vector.y * 20)},
                                                                    {
                                                                            x : this.parent.point.vector.x * -1, 
                                                                            y : this.parent.point.vector.y * -1
                                                                    });

                                this.edges.push(new Edge(point, updatedStartPoint));

                                this.processMeta(currentChild, spacialIndex);

                                currentChild.point = updatedStartPoint;
                                currentChild.vector = updatedStartPoint.vector;
                                currentChild.meta = false;

                            }

                            index++;

                        }

                    

                    this.mode="cascading";

            }

            if (this.mode==="cascading" || this.mode==="intersecting" || this.mode==="combined"){
                
                var collisionResults, smallestBox = aabb;

                // we iterate through all the chdilren
                index = 0;
                while(index < this.length){
                    
                    point = this.children[index].point;
                    vector = point.vector;

                    // we know it's a collision but we want it's relative position

                    extentBox = extendConnectorToLimit(point, this.collisions, aabb, this);

                    if (extentBox.hw===0.5 && extentBox.hh < aabb.hh){
                
                            
                            extentBox.position(aabb.x, extentBox.y)
                                     .size(aabb.hw * 2, extentBox.hh * 2);
                            
                            if (smallestBox.hh > extentBox.hh){
                                
                                smallestBox = extentBox;

                            }

                    }else if (extentBox.hh===0.5 && extentBox.hw < aabb.hw){
                        
                            extentBox.position(extentBox.x, aabb.y)
                                     .size(extentBox.hw * 2, aabb.hh * 2);

                            if (smallestBox.hw > extentBox.hw){
                                
                                smallestBox = extentBox;

                            }

                    }

                    index++;

                    

                }

                sharedBox = smallestBox;

                if (this.parent.point.vector.x!==0){
                    
                    sharedPoint = new Point({x : (smallestBox.x + (smallestBox.hw)), y : this.parent.point.y}, this.parent.point.vector);
                

                }else{
                    
                    sharedPoint = new Point({x : this.parent.point.x, y : (smallestBox.y + (smallestBox.hh))}, this.parent.point.vector);
                }


            }else if (this.mode==="heuristic"){
                
                // we're not really doing any clever collision detection here.
                    point = this.parent.point;
                    vector = point.vector;

                    extentBox = extendConnectorToLimit(point, this.collisions, aabb, this);

                    sharedPoint = new Point({
                        
                        x : extentBox.x + extentBox.hw + ((extentBox.hw) * vector.x),
                        y : extentBox.y + extentBox.hh + ((extentBox.hh) * vector.y)

                    }, this.parent.point.vector);

            } else if (this.mode!=="ultimate-evil-edge-group-of-doom"){


                this.status = "clean";
                // make a shared point in the center of this.
                sharedBox = aabb;

                sharedPoint = new Point({x : (this.parent.point.x + (aabb.hw * this.parent.vector.x)), y : (this.parent.point.y + (aabb.hh * this.parent.vector.y))}, this.parent.point.vector);

            }

            // we only create edges if there's a shared point.

            if (sharedPoint){

                this.resolveChildrenWithSharedPoint(sharedPoint, spacialIndex);

            }       
        
                    
        };

    }(),

    convertEdgeIntoBoundingBox : function( startPoint, endPoint ){
        
        var minX, maxX, minY, maxY, height, width;

        minX = maxX = startPoint.x;
        minY = maxY = startPoint.y;

        minX = Math.min(minX, endPoint.x);
        maxX = Math.max(maxX, endPoint.x);

        minY = Math.min(minY, endPoint.y);
        maxY = Math.max(maxY, endPoint.y);

        height = Math.max(4, maxY - minY);
        width = Math.max(4, maxX - minX);

        return new BoundingBox( new Vector2D(minX -2, minY -2), new Vector2D(width, height) );
        
    },

    resolveChildrenWithSharedPoint : function(sharedPoint, spacialIndex){
        
        var index, pt, vector, x, y;
            // SNAPPING for horizontal one to one edges
            if (this.length===1 && this.parent.point.compareDirection(this.children[0].point)===-1 && this.parent.point.vector.y===0){
        
                if (this.children[0].point.y < this.parent.point.y + 10 && this.children[0].point.y > this.parent.point.y - 10 ){
                    
                    sharedPoint = new Point({x : this.parent.point.x, y : (this.children[0].point.y + (this.parent.point.y - this.children[0].point.y) / 2 )}, this.parent.point.vector);

                    this.parent.point.y = sharedPoint.y;
                    this.children[0].point.y = sharedPoint.y;

                    this.snapped = true;

                }

            }

            // convert the edge into bounding box

            // push an edge from teh parent to the shared point

            if (!this.snapped){
            this.edges.push(new Edge(this.parent.point, sharedPoint));
            }

            if (this.parent.meta && this.parent.meta.type==="directional"){
                        
                this.createArrow(this.parent.point, this.parent.point.vector);

            }

            index = 0;

            while(index < this.length){

                pt = this.children[index].point;
                vector = pt.vector;

                if (vector.x!==0){

                    x = sharedPoint.x;
                    y = pt.y;

                }else{
                
                    x = pt.x;
                    y = sharedPoint.y ;
                                                    
                }

                edgePoint = new Point({x : x, y: y});

                if (this.mode==="heuristic" && this.potentialCollision){


                    var edgePointToSharedBox = this.convertEdgeIntoBoundingBox(edgePoint, sharedPoint);
                    //edgePointToSharedBox.draw(debugContext, '#f00');

                    var collisions = this.checkForCollisions(edgePointToSharedBox, this.collisions);

                    var j = 0, maxX = 0, maxY = 0;

                    while(j < collisions.length){
                        
                        maxX = ((Math.max(collisions[j].x, maxX) + 20) * this.parent.point.vector.x);
                        maxY = ((Math.max(collisions[j].y, maxY) + 20) * this.parent.point.vector.y);
                        j++;
                    }

                    var pushedOutEdgePoint = new Point({ x : edgePoint.x + maxX, y: edgePoint.y + maxY});
                    var pushedOutSharedPoint = new Point({ x : sharedPoint.x + maxX, y: sharedPoint.y + maxY});

                    this.edges.push(new Edge(sharedPoint, pushedOutSharedPoint ));
                    this.edges.push(new Edge(edgePoint, pushedOutEdgePoint ));
                    this.edges.push(new Edge(pushedOutSharedPoint, pushedOutEdgePoint ));

                }else{
                    
                    this.edges.push(new Edge(edgePoint, sharedPoint));
                }

                /*

                */


                this.edges.push(new Edge(this.children[index].point, edgePoint));

                this.processMeta(this.children[index], spacialIndex );

                index++;

            }

    },

    processMeta : function(currentChild){
        
            var B = BoundingBox, V = Vector2D, point = currentChild.point, vector = point.vector;

            if (currentChild.meta){

                if (currentChild.meta.type==="directional"){
                    
                    this.createArrow(point);

                }

                if (currentChild.meta.label!==""){
                    
                        var labelGeo = currentChild.meta.labelGeometry, label;

                        if (vector.x===1){
                            
                            label = new B ( new V(point.x + 10, point.y - (labelGeo.height + 5)), new V(labelGeo.innerWidth, labelGeo.innerHeight) );

                        }else if (vector.x===-1){

                            label = new B ( new V(point.x - (labelGeo.width + 10), edgePoint.y - (labelGeo.height + 5)), new V(labelGeo.innerWidth, labelGeo.innerHeight) );

                        }else if (vector.y===1){
                            
                            label = new B ( new V(point.x + 5, point.y + 5), new V(labelGeo.innerWidth, labelGeo.innerHeight) );

                        }else if (vector.y===-1){
                            
                            label = new B ( new V(point.x + 5, point.y - (labelGeo.height + 5)), new V(labelGeo.innerWidth, labelGeo.innerHeight) );
                        }

                        if (!this.labels){
                            
                            this.labels = [];

                        }
                        this.labels.push(new Label(currentChild.meta.label, label));

                }


            }

    }, 

    createArrow : function(point){

        var arrowSize = 5, arrowPoints = [], vector = point.vector,

        nw = new Point({ x: point.x - arrowSize, y: point.y - arrowSize }),
        ne = new Point({ x: point.x + arrowSize, y: point.y - arrowSize }),
        se = new Point({ x: point.x + arrowSize, y: point.y + arrowSize }),
        sw = new Point({ x: point.x - arrowSize, y: point.y + arrowSize });

        arrowPoints[1] = point;

        if (vector.x===0 && vector.y===-1) {

            arrowPoints[0] = nw;
            //points[1].y-= 3;
            arrowPoints[2] = ne;

        } else if (vector.x===0 && vector.y===1) {
            arrowPoints[0] = sw;
            //points[1].y+= 3;
            arrowPoints[2] = se;
        } else if (vector.x===-1 && vector.y===0) {
            arrowPoints[0] = nw;
            //points[1].x-= 3;
            arrowPoints[2] = sw;
        } else {
            arrowPoints[0] = ne;
            //points[1].x+= 3;
            arrowPoints[2] = se;
        }

        this.edges.push(new Edge(arrowPoints[0], arrowPoints[1]));
        this.edges.push(new Edge(arrowPoints[1], arrowPoints[2]));

    }

};

module.exports.createEdgeGroups = function edgeGroupCreator (edges, nodes){

    var i, j, initialLength = edges.length;
    var inGroup = [];
    var collections;
    var edgegroups = [];

    i = initialLength;

    while (i--) {

        if (!edgegroups[i]){
            edgegroups[i] = new EdgeGroup(i);
        }

        j = initialLength;

        while(j--){
            if (edges[j]){
                if ((edges[j].source===edges[i].source && edges[j].sourceSide===edges[i].sourceSide) || (edges[j].target===edges[i].target  && edges[j].targetSide===edges[i].targetSide)){
                    
                    if (!inGroup[j]){

                        edgegroups[i].addChild( nodes[edges[j].source], edges[j].sourceSide, nodes[edges[j].target], edges[j].targetSide, edges[j].type, edges[j].label, edges[j].labelGeometry || {}, edges[j].uid );

                        inGroup[j] = true;
                    }
                }
            }
        }

        if (!edgegroups[i].length || edgegroups[i].length===0){
            delete edgegroups[i];
        }else{
            edgegroups[i].complete();
        }
    }
    return edgegroups;
};

module.exports.processEdgeGroups = function edgeGroupProcessor(edgeGroups, spatialIndex){

    var index = 0;
    // pass 1: cascading, intersecting, heuristic
    while(index < edgeGroups.length){
        if (edgeGroups[index]){
            edgeGroups[index].createEdges( spatialIndex );
        }
        index++;
    }

    return edgeGroups;
};

function convertDirectionToVector (str){

    if ( str==="bottom" ){
        
        return new Vector2D(0, 1);

    } else if ( str==="top" ){
        
        return new Vector2D(0, -1);

    } else if ( str==="left"){
        
        return new Vector2D(-1, 0);

    } else if ( str==="right"){
        
        return new Vector2D(1,0);

    } else {
        
        return new Vector2D(0, 1);

    }

}
