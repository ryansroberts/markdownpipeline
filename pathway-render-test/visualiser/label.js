/********************************************************************
*
* Filename:     Label.js
* Description:  For drawing Labels.
*   
********************************************************************/

function Label(text, aabb) {

    try {
        this.aabb = aabb;
        this.text = text;
        return this;

    }catch(e){

        return {
            // null handler
            draw : function(){}

        };

    }
    return this;
}

Label.prototype = {

    draw : function( htmlLayer, scale ){
        
        // draw the label

        var label = $('<div></div>');
        label.addClass('label')
            .css({
                "left" : this.aabb.x * scale,
                "top" : this.aabb.y * scale,
                "position" : "absolute",
                "text-align" : "center",
                "font-size" : 0.8 * scale + "em"
            })
            .text(this.text);

        htmlLayer.append(label);

        return this;
    }
};

module.exports = Label;

