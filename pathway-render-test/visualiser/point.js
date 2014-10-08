/********************************************************************
*
* Filename:     Point.js
* Description:  For creating and processing points
*   
********************************************************************/

var Vector2D = require('./vector-processing-and-bounding-box').Vector2D;

function Point (point, vector){

    try {

        this.point = new Vector2D(point.x, point.y);
        this.vector = vector ? new Vector2D(vector.x, vector.y) : new Vector2D(0,0);

        this.x = this.point.x;
        this.y = this.point.y;
        this.vx = this.vector.x;
        this.vy = this.vector.y;

        return this;

    }catch(e){

        return {};

    }
}

Point.prototype = {

    compareDirection : function ( point){
        
        return this.vector.dotProduct(point.vector);

    }

};

module.exports = Point;

