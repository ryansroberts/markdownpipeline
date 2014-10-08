/********************************************************************
*
* Filename:     scoll.js
* Description:  manages scroll bars and content
*   
********************************************************************/

require('../lib/jquery-plugins/jquery-mousewheel.js');

var domcache = require('../core/dom-cache.js');
var Tween = require('../visualiser/tween.js');

function Scrollbar (obj){

    var self = this;

    // We have some useful defaults here...
    // let's mix in the other information.
    this.config = $.extend({        
        size: 10,
        align: 'vertical',
        horizontalGutter: 8,
        verticalGutter: 25,
        callback : function(){},
        parent : $('body')
    }, obj );

    this.container = $('<div></div>');

    this.container
        .css('position', 'absolute')
        .addClass('scrollbar-background');

    this.handle = $('<div></div>');

    this.handle
        .css('position', 'absolute')
        .addClass('scrollbar-handle')
        .css('top', 0)
        .css('left',0);

    if(this.config.align==='horizontal'){

        this.sizeAttr = 'width';
        this.positionAttr = 'left';
        this.gutter = this.config.horizontalGutter;

        this.container
            .css('bottom', this.config.verticalGutter)
            .css('left', this.config.horizontalGutter)
            .css('height', this.config.size);

        this.handle
            .css('height',this.config.size);

    }else{

        this.sizeAttr = 'height';
        this.positionAttr = 'top';
        this.gutter = this.config.verticalGutter;

        this.container
            .css('top', this.config.verticalGutter)
            .css('right', this.config.horizontalGutter)
            .css('width', this.config.size);

        this.handle
            .css('width',this.config.size);

    }

    this.container.css(this.sizeAttr, 50);
    this.handle.css(this.sizeAttr, 50);

    // There's values for the external owner. E.g, 0 to -700.
    this.owner = {
        min : 0,
        max : 0,
        value : 0,
        contentSize : 0,
        clipSize : 0
    };

    // Then there's values for the scroll bar itself, the extent of its travel.
    this.self = {
        min : 0,
        max : 0,
        value : 0,
        pathSize : 0,
        handleSize : 0
    };

    // HTML generation for the scroll bar

    obj.parent.css('position', 'relative');

    this.container.bind('click', (function(){
        if(self.config.align==='horizontal'){

            return function(e){
                if(!$(e.target).is('div.scrollbar-handle')){
                    e.stopPropagation();
                    e.preventDefault();

                    self.centerOn(e.offsetX);
                }
                //var lastX = 0;
        
            };

        }else{
                        
            return function(e){
                if(!$(e.target).is('div.scrollbar-handle')){
                    e.stopPropagation();
                    e.preventDefault();

                    self.centerOn(e.offsetY);
                }

            };

        }
    }()));

    if(!('ontouchstart' in window)){

        var mouseUp;

        mouseUp = function(e){

            $(this).unbind('mousemove');

            $('body').css('cursor', 'default');
            $('this').css('cursor', 'pointer');

            if(self.config.onEnd){
                self.config.onEnd();
            }

            $(document).unbind('mouseup', mouseUp);

        };

        this.handle.bind('mousedown', (function(){
    

            if(self.config.align==='horizontal'){

                return function(e){

                    if(self.config.onStart){
                        self.config.onStart();
                    }

                    e.stopPropagation();
                    e.preventDefault();

                    var startX = e.clientX;
                    var lastX = 0;

                    $('body').css('cursor', 'W-resize');
                    $(this).css('cursor', 'W-resize');
            
                    $(document)
    
                    .bind('mousemove', function(e){
                            e.preventDefault();
                                // where we move, taking into account the values from the last tick..
                            self.position((lastX - (e.clientX - startX)) * -1);

                                // then save for next time...
                            lastX = e.clientX - startX;
                            })

                    .bind('mouseup', mouseUp);
            


                };

            }else{
                            
                return function(e){

                    if(self.config.onStart){
                        self.config.onStart();
                    }
                    e.stopPropagation();
                    e.preventDefault();

                    var startY = e.clientY;
                    var lastY = 0;

                    $('body').css('cursor', 'N-resize');
                    $(this).css('cursor', 'N-resize');

                    $(document)
                    .bind('mousemove', function(e){
                            e.preventDefault();
                                // where we move, taking into account the values from the last tick..
                            self.position((lastY - (e.clientY - startY)) * -1);

                                // then save for next time...
                            lastY = e.clientY - startY;
                            })
            
                    .bind('mouseup', mouseUp);

                };

            }

        }()));

    }
    // append the scroll handle
    this.container.append(this.handle);

    // append the scrollbar container
    obj.parent.append(this.container);


    return this;

}

Scrollbar.prototype = {
    // prototype methods for the scroll bar
    extents : function( min, max ){

        // Internally the scrollbar works from 0-100%. However it returns a real useful value.
        // Therefore it must know the value for 0% and 100%
        if(arguments.length===2){

            this.owner.min = min || 0;
            this.owner.max = max || 0;

            return this;

        }else{

            return {
                min : this.owner.min,
                max : this.owner.max
            };

        }

    },

    clip : function ( val ){
        // set/get the content height. 

        if( val ){
            // setting.
            this.owner.clipSize = val;

            this.resize();

            return this;

        }else{ 

            return this.owner.clipSize;

        }

    },

    content : function ( val ){

        if( val ){
            
            this.owner.contentSize = val;


            this.resize();

            return this;


        } else {
            return this.owner.contentSize;
        }

    },
    // sets the value based on the 'owner'
    value : function( val ){
        
        if( typeof val === 'number' ){
            this.owner.value = val;

            var ownerFraction = (this.owner.max - this.owner.min) / 100;
            var selfFraction = (this.self.max - this.self.min) / 100;

            var valFraction = (val / ownerFraction);

            if(!valFraction){
                valFraction = 0;
            }

            this.self.value = Math.floor(selfFraction * valFraction);

            // Now self we have the value, we can move the handle
            this.handle.css(this.positionAttr, Math.round(this.self.value));

            return this;
        }else{
            return this.owner.value;
        }

    },

    position : function( val ){
        

        val = val + this.self.value;

        if(val < this.self.min){
            val = this.self.min;
        }else if(val > this.self.max){
            val = this.self.max;
        }

        // convert self value to owner value. 

        var ownerFraction = (this.owner.max - this.owner.min) / 100;
        var selfFraction = (this.self.max - this.self.min) / 100;

        val = Math.floor(ownerFraction * ( val / selfFraction));

        this.config.callback(val);


        return this;

    },

    centerOn : function( val ){

        val = val - Math.floor(this.self.handleSize / 2);
        
        if(val < this.self.min){
            val = this.self.min;
        }else if(val > this.self.max){
            val = this.self.max;
        }

        var self = this;

        var tween = new Tween({
            start : this.self.value || 0,
            end : val,
            duration: 750,
            easing: "ease-out-expo",
            fps : 30,
            callback : function( obj ){
                    var ownerFraction = (self.owner.max - self.owner.min) / 100;
                    var selfFraction = (self.self.max - self.self.min) / 100;
                    var val = Math.floor(ownerFraction * ( obj.val / selfFraction));
                    self.config.callback(val);
                }
        });

        tween.play();

    },

    calculateDimensions : function(){

        var self = this.self;
        var owner = this.owner;

        self.pathSize = Math.floor(owner.clipSize - (this.gutter * 2));
        
        // whatever percent the clip is of the content, apply self to the path height. 
        self.handleSize = Math.floor(self.pathSize * (owner.clipSize / owner.contentSize));

        self.max = self.pathSize - self.handleSize;

        return this;

    },

    resize : function(){

        this.calculateDimensions();
        // 
        if(this.owner.contentSize < this.owner.clipSize){

                this.container.hide();

        }else{

            this.container.show();

            if('ontouchstart' in window){


                this.container.css('visibility', 'hidden');
                this.handle.css({'visibility': 'visible', 'opacity' : 'none'});
                
            }

            this.container.css(this.sizeAttr, this.self.pathSize + "px");
            this.handle.css(this.sizeAttr, Math.max(5, this.self.handleSize) + "px");

        }

        return this;

    },

    reset : function(){
        this.self.value = 0;
        this.resize();
        this.position(0);

        return this;
    },

    resetToCurrentPosition : function(){
        this.resize();
        this.position(0);
        return this;
    }

};

function Scroller (content, config){

    var self = this;

    // Get a reference for later
    this.content = content;
    // then let's set its width and height to auto. We do not wish to restrict 

    // We're going to make the content element a child of another element. This is it, 'ere. 
    this.clipWindow = $('<div style="overflow:hidden;"></div>');

    this.clipWindow.addClass('clip-window');

    // The two magic variables
    this.contentHeight = 0;
    this.clipHeight = 0;

    this.config = {
        // the scrollbar will be attached to this...
        parent: this.clipWindow,
        // please send your output to moveAbsolute. kkthxbai.
        callback: function (val) {
            self.position(val);
        },
        scrollbarPadding: 30,
        size: 10,
        align: 'vertical',
        horizontalGutter: 8,
        verticalGutter: 25
    };

    if (config) {
        $.extend(this.config, config);
    }

    // And having created a nice wrapper, we clear out the sizing information for the content...
    this.content
        .css('width', 'auto')
        .css('height', 'auto')
        .css('position', 'relative')
    // prepend its new parent...
        .before(this.clipWindow);
    // then make it the parent
    this.clipWindow
        .append(content)
    //.css('position','absolute');
        .css('padding-right', this.config.scrollbarPadding);

    if ('ontouchstart' in window) {

        var startDrag;

        startDrag = function (e) {

            function moveDrag(e) {
                if (e.touches.length === 1) {
                    var currentPos = getCoors(e);
                    //var deltaX = currentPos[0] - origin[0];
                    var deltaY = currentPos[1] - origin[1];

                    self.position(initialPosition + (currentPos[1] - origin[1]));

                    return false; // cancels scrolling
                }
            }

            function getCoors(e) {
                var coors = [];
                if (e.targetTouches && e.targetTouches.length) {    // iPhone
                    var thisTouch = e.targetTouches[0];
                    coors[0] = thisTouch.clientX;
                    coors[1] = thisTouch.clientY;
                } else {    // all others
                    coors[0] = e.clientX;
                    coors[1] = e.clientY;
                }
                return coors;
            }

            this.ontouchmove = moveDrag;
            this.ontouchend = function () {
                this.ontouchmove = null;
                this.ontouchend = null;
                this.ontouchstart = startDrag; // Dolfin
            };

            var origin = getCoors(e);
            var initialPosition = self.position();

        };

        this.clipWindow[0].ontouchstart = startDrag;


    } else {

        // bind mousewheel functionality...
        this.clipWindow.bind('mousewheel', function (e, delta) {
            e.preventDefault();
            // invoke the moveRelative method..
            self.position(delta * 100, 'rel');
        })


        .bind('mousedown', function (e, delta) {

            // on mouse down, we take the current Y position.

            //e.preventDefault();
            var startY = e.clientY;
            var lastY = 0;

            // then bind a function to mousemove...
            $(document).bind('mousemove', function (e) {
                //e.preventDefault();
                // where we move, taking into account the values from the last tick..
                self.position((lastY - (e.clientY - startY)), 'rel');

                // then save for next time...
                lastY = e.clientY - startY;

            });

            $(document).bind('mouseup', function (e) {
                // or we unbind.
                $(this).unbind('mousemove');

            });
        });

    }

    // create a scrollbar object.

    this.scrollbar = new Scrollbar(this.config);

    this.extraHeight = 0;

    return this;

}

Scroller.prototype = {

    html : function(html){

        // this neatly wraps the jQuery method, 'HTML', except does clever things instead. 

        // put content in the content, as expected...
        this.rawContent = html || "";
        this.content.html(this.rawContent);

        // measures it...
        this.contentHeight = this.content.outerHeight();

        this.extraHeight = 0;

        this.updateScrollBar();

        return this;
    },

    resize : function(obj){

        // change the container
        this.clipHeight = obj.height;



        this.content.css('width', obj.width - this.config.scrollbarPadding - (this.config.horizontalGutter * 2));
        this.clipWindow.css('height', obj.height);
        // tell the scroll bar the new clip height
        this.scrollbar.clip(obj.height);

        this.contentHeight = this.content.outerHeight();
        

        // tell the scroll bar the new content height...
        this.scrollbar.content( this.contentHeight );

        // update the scroller geometry
        this.refresh();
        //
        // because we've changed the clip window height, it's possible for the scroller to get out of bounds
        if(Math.abs(this.position()) > Math.abs(this.max)){
            this.position( this.max );
        }else{
            this.scrollbar.value(this.position());
        }

    },

    updateScrollBar : function(){
        
        // tell the scroll bar the new content height...
        this.scrollbar.content( this.contentHeight );

        // update the scroller geometry
        this.refresh();

        this.scrollbar.reset();

    },

    updateScrollBarNoReset : function(){
        
        // tell the scroll bar the new content height...
        this.scrollbar.content( this.contentHeight );

        // update the scroller geometry
        this.refresh();

        this.scrollbar.resetToCurrentPosition();
    },

    expandContent : function( obj ){
        
        if(obj.height){
            
            this.extraHeight = obj.height;

            this.contentHeight = this.content.outerHeight() + this.extraHeight;

            this.updateScrollBarNoReset();

        }

        return this;

    },

    shrinkwrapContent : function(){

        // had to stop using the rawContent as it didnt copy the 'binding'
        // for the reader panel back button - use 'extraHeight' instead
        if(this.extraHeight > 0){
            
            this.contentHeight -= this.extraHeight;

            this.updateScrollBarNoReset();

            this.extraHeight = 0;
        }

    },


    moveRelative : function ( val ){

        // increment or decrement the existing position value
        this.moveAbsolute( this.position + val );

        //this.debugWindow.html( val );

    },

    position : (function ( ){

        // we hide the position inside a closure
        var pos = 0;

        return function( val, rel ){
        
            if(rel && rel==="rel"){
                val = val + pos;
            }

            if(arguments.length > 0){

                if(val > this.min){
                    pos = 0;
                }else if(val < this.max){
                    pos = this.max;
                }else{
                    pos = Math.floor( val );
                }

                this.content.css('top', pos);

                this.scrollbar.value( Math.round(pos)  );

            }else{

                return pos;

            }
        };  
    }()),

    refresh : function (){

        // with a clip height and content height, this method should calculate the min and max for the scrolling window.

        this.max = Math.min(0, (this.contentHeight - this.clipHeight) * -1);
        this.min = 0;

        this.scrollbar.extents(this.min, this.max);

        return this;

    },

    scrollToEnd : function(){

        var self = this;

        var tween = new Tween({
            start : this.position(),
            end : this.max,
            duration: 750,
            easing: "ease-out-expo",
            fps : 30,
            callback : function( obj ){
                    self.position( obj.val );
                }
        });
        if(this.position()!==this.max){
            tween.play();
        }

    },

    scrollToBeginning : function(){
        this.position( this.min );
    }
};

module.exports.Scroller = Scroller;
module.exports.Scrollbar = Scrollbar;
