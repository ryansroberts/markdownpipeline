/********************************************************************
*
* Filename:     tween.js
* Description:  For handling animation. Usage: 
*               var tween = PATHWAYS.tween({
*                       start: Number, 
*                       end: Number, 
*                       duration: Number, 
*                       easing: String "accelerate|decelerate|linear|bubble", 
*                       callback: Function
*               });
*               tween.play();               
*
*               OR
*
*               tween.rewind();             
*   
********************************************************************/

/*

    The original Pathways Tween code has been replaced with a new, more modern
    module. This just wraps it to expose the same API as the old Pathways Tween.

*/

var Tween = require('gm-tween').Tween;

var PathwaysTween = function( config ){

    var ani = new Tween({ val : config.start})
        .to({val : config.end})
        .using(config.easing)
        .duration(config.duration)
        .tick(config.callback);

    if (config.onComplete){
        ani.finish(config.onComplete);
    }

    return ani;

};

module.exports = PathwaysTween;

