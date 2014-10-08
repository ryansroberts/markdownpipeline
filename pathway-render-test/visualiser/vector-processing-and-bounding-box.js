/********************************************************************
*
* Filename:     vector-processing-and-bounding-box.js
* Description:  Helpers for dealing with collision detection
*   
********************************************************************/

function Vector2D (x, y){

    try {

        this.x = x;
        this.y = y;

        return this;

    }catch(e){
        throw ("Invalid number of arguments to Vector2D");
    }

}

Vector2D.prototype = {

    toString : function(){
        return "x : " + this.x + ", y : " + this.y;
    },
    translate : function(){
        var x, y;

        if(arguments.length > 0){
            if(typeof arguments[0]==='number' && typeof arguments[1]==='number'){
            
                x = arguments[0];
                y = arguments[1];   
            
            }else if(isVector2D(arguments[0])){
            
                x = arguments[0].x;
                y = arguments[0].y;
                
            }else{
            
                return this;
            
            }
            
            this.x += x;
            this.y += y;
            
        }
        
        return this;
    },
    move : function(){
        var x, y;
        if(arguments.length > 0){
            if(typeof arguments[0]==='number' && typeof arguments[1]==='number'){
                x = arguments[0];
                y = arguments[1];
            }else if(isVector2D(arguments[0])){
                x = arguments[0].x;
                y = arguments[0].y;
            }
        }else{
        
            x = 0;
            y = 0;
        
        }
        this.x = x;
        this.y = y;
        
        return this;

    },
    clone : function(){
        var copy = new Vector2D(this.x, this.y);
        if(arguments.length > 0){
            // return the clone, translated
            if(typeof arguments[0]==='number' && typeof arguments[1]==='number'){
                return copy.translate(arguments[0], arguments[1]);
            }else{
                return copy.translate(arguments[0]);
            }

        }else{
            // copy the existing object
            return new Vector2D(this.x, this.y);
        }
    },
    // More advanced maths here....
    dotProduct : function(point){

        var b_op;
        if(point && isVector2D(point)){
            // a.b
            b_op = point;
            
        }else{
            // a.a
            b_op = this;
            
        }
        return (this.x * b_op.x) + (this.y * b_op.y);
    },
    normalise : function(){
        var len = this.length();
        this.x = this.x / len;
        this.y = this.y / len;
        
        return this;
    },
    getNormal : function( flag ){
        if(flag){
        return new Vector2D(0 - this.y, this.x);
        }else{
        return new Vector2D(this.y, 0 - this.x);
        }
    },
    length : function(){
        return Math.sqrt(this.dotProduct());
    },
    distance : function(point){
        if(point && isVector2D(point)){
            return Math.sqrt(this.dotProduct(point));
        }
        return this.length();
    }       
};

function BoundingBox (position, size){

    var _pos,_size;

    if(arguments.length===2 && position && size && isVector2D(position) && isVector2D(size)){
    
        _pos = position;
        _size = size;
    
    }else{

        _pos = new Vector2D(0,0);
        _size = new Vector2D(1,1);

    }
    this.x = _pos.x;
    this.y = _pos.y;
    this.hw = _size.x / 2;
    this.hh = _size.y / 2;

    return this;

}

BoundingBox.prototype = {

    position : function(){

        var _pos;

        if(arguments.length===0){
            return new Vector2D(this.x, this.y);

        }else{

            if(typeof arguments[0]==="number" && typeof arguments[1]==="number"){
            
                _pos = new Vector2D(arguments[0],arguments[1]);
                
            }else if(new Vector2D(arguments[0])){
                
                _pos = arguments[0];
            
            }
            
            this.x = _pos.x;
            this.y = _pos.y;

            return this;

        }
    },
    size : function(){

        var _size;

        if(arguments.length===0){
            return new Vector2D(this.hw * 2, this.hh * 2);
        }else{

            if(typeof arguments[0]==="number" && typeof arguments[1]==="number"){
            
                _size = new Vector2D(arguments[0],arguments[1]);
                
            }else if(isVector2D(arguments[0])){
                
                _size = arguments[0];
            
            }
            
            this.hw = _size.x / 2;
            this.hh = _size.y / 2;

            return this;

        }
    },
    testForCollision : function( obj ){
        // obj must be another boundingBox2D
        try{
                   //  total width of     -      x + half width   -  other x + half witdth
                   // the two halves...
            var px = (obj.hw + this.hw) - Math.abs((this.x + this.hw) - (obj.x + obj.hw));
            
            // if px is greater than zero there's no overlap on this axis, and that means there's definitly no
            // collision - collision means there's an overlap on ALL axises we test.
            
            if(0 < px){
            
                // Okay so the x axis overlaps. We can't tell if there's a collision until we've
                // tested the y axis as well. 
            
                var py = (obj.hh + this.hh) - Math.abs((this.y + this.hh) - (obj.y + obj.hh));
                
                if(0 < py){
                
                    return {x : px, y : py, hw : obj.hw, hh : obj.hh};
                
                }
            
            }

        }catch(e){
            throw("Invalid object passed to isRectWithinBounds");
        }
        return false;
    },      
    subdivide : function(){

        var subDivSize, rects = {};
        
        subDivSize = new Vector2D(this.hw, this.hh);
        
        rects.nw = new BoundingBox(new Vector2D(this.x , this.y), subDivSize);
        rects.ne = new BoundingBox(new Vector2D(this.x + this.hw, this.y), subDivSize);
        rects.se = new BoundingBox(new Vector2D(this.x + this.hw, this.y + this.hh), subDivSize);
        rects.sw = new BoundingBox(new Vector2D(this.x, this.y + this.hh), subDivSize);
        
        return rects;
        
    },
    getCollidingQuadrants : function( obj ){
    
        var vector = obj.testForCollision(this),
        matches = [false, false, false, false],
        top = true, bottom = true, left = true, right = true;

        if(vector){

            if(this.x > obj.x){

                if(this.y > obj.y){
                
                    if(this.x + (this.hw * 2) <  obj.x+ (obj.hw * 2)){

                        if(this.y + (this.hh * 2) < obj.y+ (obj.hh * 2) ){

                            return "engulfed";

                        }

                    }

                }

            }


            if( (obj.x + (obj.hw * 2)) < (this.x + this.hw)){
                    // can't collide with right hand quads
                    right = false;

            }else if(obj.x > (this.x + this.hw)){
                    // can't collide with left hand quads
                    left = false;

            }

            if( (obj.y + (obj.hh * 2)) < (this.y + this.hh)){
                    // can't collide with right hand quads
                    bottom = false;

            }else if(obj.y > (this.y + this.hh)){
                    // can't collide with left hand quads
                    top = false;

            }

            if(top && left){ matches[0] = true; }
            if(top && right){ matches[1] = true; }
            if(bottom && right){ matches[2] = true; }
            if(bottom && left){ matches[3] = true; }

            return matches;

        }

        return "no match";


    },
    translate : function(){

        var _pos;

        if(arguments.length > 0){
        
            if(typeof arguments[0]==="number" && typeof arguments[1]==="number"){
            
                _pos = new Vector2D(arguments[0],arguments[1]);
                
            }else if(isVector2D(arguments[0])){
                
                _pos = arguments[0];
            
            }
            this.x += _pos.x;
            this.y += _pos.y;

        }
        return this;
    },
    draw : function(drawContext, color, option){
        var colour;
        if(!option){
            colour = color || 'rgba(200,200,200,0.8)';
            drawContext.strokeStyle = colour;
            drawContext.lineWidth = 1;
            drawContext.strokeRect(Math.round(this.x) + 0.5, Math.round(this.y) + 0.5, Math.round(this.hw * 2), Math.round(this.hh * 2));
        }else{
            colour = color || 'rgba(200,200,200,0.8)';
            drawContext.fillStyle = colour;
            drawContext.fillRect(Math.round(this.x) + 0.5, Math.round(this.y) + 0.5, Math.round(this.hw * 2), Math.round(this.hh * 2));

        }

        return this;

    
    }

};

function isVector2D(obj, testMethods){
    var method;

    if(typeof obj.x==="number" && typeof obj.y==="number"){     
    
        if(testMethods){
            for(method in Vector2D.prototype){
                if(!obj[method]){
                    return false;
                }
            }
        }

        return true;
    }
    return false;                       
}

// exports...
module.exports.BoundingBox = BoundingBox;
module.exports.Vector2D = Vector2D;
module.exports.isVector2D = isVector2D;
