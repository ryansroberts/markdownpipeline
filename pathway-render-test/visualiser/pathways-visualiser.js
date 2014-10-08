/*

    Pathways Visualiser is responsible for taking parsed xml versions of Paths and 
    preparing them for rendering (measuring, etc). 


*/

require('../lib/jquery-plugins/jquery-mousewheel.js');

//var broker = require('../framework/pubsub.js');
var config = require('../core/config.js');
var domcache = require('../core/dom-cache.js');

var Scrollbar = require('../utils/scroll-panel.js').Scrollbar;
var PathView = require('./path-view.js');

var raf = require('raf');
var transform = require('../lib/detect-transform.js');
var applyMatrix = require('matrix-to-css');
var mat4 = require('gl-matrix-mat4');
var vec3 = require('gl-matrix-vec3');

var defaultScale = 1;

function PathwaysVisualiser (){

    // our container...
    this.viewContainer = $('<div id="path-view-container" style="position:absolute;top:0;left:0;"></div>');
    $(config.system.pathSelector).append(this.viewContainer);

    this.addCopyright();

    // basic view data...
    this.view = {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        horizontal: {
            min: 0,
            max: 0
        },
        vertical: {
            min: 0,
            max: 0
        }
    };

    this.initialiseScrolling();

    broker.subscribeBatch(this, {
        "new path xml loaded" : "renderPath",
        "event-main-view-resized" : "resizePathLayer",
        "request deselect nodes" : "deselectAllNodes",
        "request select node" : "selectNode",
        "event-debug-path-only" : "printVisualisationMode",
        "event-debug-get-path-data" : "getPathVisualisationMetrics"
    });

}

PathwaysVisualiser.prototype = {

    renderPath : function ( data ){

        // probably offload this to another module. This module is just about managing the container
        // the path sits inside.

        var _this = this;

        this.pathData = data;

        broker.publish("we are loading stuff");

        // using a timeout seems like a terrible, pointless thing but what actually happens here is that
        // processing the path view consumes so many resources that the browser never gets round to showing 
        // the loading screen. Therefore we basically temporarily release control in order to give the 
        // browser chance to update the screen. This is crucial for mobile where generating pathways 
        // can take longer than 100ms to complete.

        setTimeout(function(){

            $('#path-view-container').empty();
            $('#path-view-container').css('transform', applyMatrix(mat4.create()) );

            _this.pathView = new PathView(data, $('#path-view-container'), false, defaultScale);

            _this.pathView.render();

            _this.updateDimensions(_this.pathView);

            _this.centerOnLandingNode();

            broker.publish('event-pathways-path-loaded', data);
            broker.publish('event-application-is-ready');

            broker.publish("we are not loading stuff");

        }, 5);

    },

    addCopyright : function (){

        this.copyright = $('#path-legalstuff').clone();
            this.minWidth = 435;

            this.copyright.css({
                'bottom': 2,
                'width': this.minWidth
            });
            // TMI
            this.copyright.click(function(e){

                window.location.href = $(this).attr('href');

            });
            $('#npw-path-layer').prepend(this.copyright);

    },

    repositionCopyright: function(){
        if(this.copyright){
            if(this.horizontalScrollbar.container.is(':hidden')){
                this.copyright.css({
                    'bottom': 2,
                    'width': this.minWidth
                });
            }else{
                this.copyright.css({
                    'bottom': 30,
                    'width': this.minWidth
                });
            }
        }
    },

    updateDimensions : function (){

        var data = this.pathView;

        if(data){

            var dims = {

                height: $('#pathway-application').outerHeight(), // we allow for meta and header in the overall height
                width: data.properties.pathWidth // but only the width of the path counts for the width

            };

            broker.publish('event-pathways-new-path-drawn', dims);
            broker.publish('event-application-window-resized', dims);

            // communicate the new content size to the scrollbars...
            this.horizontalScrollbar.content(data.properties.pathWidth);
            this.verticalScrollbar.content(data.properties.pathHeight);

            this.updateScrollbars(data);

        }

        return this;

    },

    updateScrollbars : function (data){

        this.view.horizontal.max = Math.min(0, ((data.properties.pathWidth * defaultScale) - this.view.width) * -1);
        this.view.vertical.max = Math.min(0, ((data.properties.pathHeight * defaultScale) - this.view.height) * -1);

        this.horizontalScrollbar.extents(this.view.horizontal.min, this.view.horizontal.max);
        this.verticalScrollbar.extents(this.view.vertical.min, this.view.vertical.max);

        return this;

    },

    resizePathLayer : function (obj){

        this.view.height = obj.height - $('#viewport h1').outerHeight(true);
        this.view.width = obj.width;

        $('#npw-path-layer').css('width', this.view.width).css('height', this.view.height);

        this.updateDimensions();
        // communicate the new clip size to the scroll bars...
        this.horizontalScrollbar.clip(this.view.width);
        this.verticalScrollbar.clip(this.view.height);

        if (this.view.top < this.view.vertical.max){
            this.position({y: this.view.vertical.max});
        }

        if (this.view.left < this.view.horizontal.max){
            this.position({x: this.view.horizontal.max});
        }

        if (this.view.top > this.view.vertical.min){
            this.position({y: this.view.vertical.min});
        }

        if (this.view.left > this.view.horizontal.min){
            this.position({x: this.view.horizontal.min});
        }

        this.repositionCopyright();

    },

    selectNode : function (nodeId){

        var _this = this;

        if(!this.pathView){

            setTimeout(function (){

                _this.selectNode(nodeId);

            },100);

        } else {

            this.pathView
                .resetView()
                .selectNode( nodeId.id );

        }

    },

    deselectAllNodes : function (){

        if(this.pathView){
            this.pathView.resetView().selectNode(false);
        }

    },

    centerOnLandingNode : function (id){

        var geometry = this.pathView.getNodeGeometry(this.pathView.getLandingNodeId());

        var _this = this;

        var x = this.view.width / 2 - (geometry.x + Math.floor(geometry.hw));
        var y = this.view.height / 2 - (geometry.y + Math.floor(geometry.hh));

        x > this.view.horizontal.min ? x = this.view.horizontal.min : null;
        x < this.view.horizontal.max ? x = this.view.horizontal.max : null;

        y > this.view.vertical.min ? y = this.view.vertical.min : null;
        y < this.view.vertical.max ? y = this.view.vertical.max : null;

        this.position({
            x : x,
            y : y
        });



        /*
    centerOnNode : function ( id ){

            var geometry = this.currentPath.pathView.getNodeGeometry( id );

            var self = this;


            // find the left/top offsets for the view self would center the node in the screen...
            var x = (this.view.width / 2) - (geometry.x + Math.floor(geometry.hw));
            var y = (this.view.height / 2) - (geometry.y + Math.floor(geometry.hh));

            x > this.view.horizontal.min ? x = this.view.horizontal.min : null;
            x < this.view.horizontal.max ? x = this.view.horizontal.max : null;

            y > this.view.vertical.min ? y = this.view.vertical.min : null;
            y < this.view.vertical.max ? y = this.view.vertical.max : null;

            var xDiff = x - this.view.left;
            var YDiff = y - this.view.top;



            this.horizontalAnimation = PATHWAYS.tween({
                start : this.view.left,
                end : x,
                duration: 750,
                easing: "decelerate",
                fps : 30,
                callback : function ( val ){
                        self.position( {left: val} );
                }
            });


            this.verticalAnimation = PATHWAYS.tween({
                start : this.view.top,
                end : y,
                duration: 750,
                easing: "decelerate",
                fps : 30,
                callback : function ( val ){
                        self.position( {top: val} );
                }
            });

            if(this.view.left !== x){

                this.horizontalAnimation.play();

            }
            if(this.view.top !== y){

                this.verticalAnimation.play();

            }

    },
        */

    },

    printVisualisationMode : function (){

        var _this = this;

        var scale = 4;

        var dim = Math.max(this.pathView.properties.pathWidth, this.pathView.properties.pathHeight);

        $(window).unbind('resize');
        $('body')
            .css({
                    overflow: 'hidden',
                    width : (dim * scale),
                    height: (dim * scale)
            });
        $('html')
            .css({
                overflow: 'hidden',
                width : (dim * scale),
                height : (dim * scale),
                background : '#fff'
            });



        var printPathSurface = $('<div></div>');

            printPathSurface.css({
                position: 'absolute',
                //overflow: 'hidden',
                width : dim * scale,
                height: dim * scale,
                top : 0,
                left: 0,
                background: '#ffffff',
                zIndex : 20000

            });

        $('body').append(printPathSurface);
        $('#container').hide();


        printView = new PathView( this.pathData, printPathSurface, 'print', scale );    
        printView.renderForPrint();

        return this;

    },

    getPathVisualisationMetrics : function (){

        var scale = 4;

        window['pathwaysDebug'] = {
            width : this.pathView.properties.pathWidth * scale,
            height: this.pathView.properties.pathHeight * scale

        };
    },

    initialiseScrolling : function (){

        var _this = this;

        // create the horizontal scrollbar
        this.horizontalScrollbar = new Scrollbar({
            // the scrollbar will be attached to this...
            parent: $(config.system.pathSelector),
            align: 'horizontal',
            size: 5,
            horizontalGutter: 15,
            verticalGutter: 5,
            callback: function (val) {
                _this.slideHorizontal(val);
            }
        });

        // create the vertical scrollbar
        this.verticalScrollbar = new Scrollbar({
            // the scrollbar will be attached to this...
            parent: $(config.system.pathSelector),
            align: 'vertical',
            size: 5,
            horizontalGutter: 5,
            verticalGutter: 15,
            callback: function (val) {
                _this.slideVertical(val);
            }
        });

        // set up event handlers for dragging/scrolling the path view... 

        if ('ontouchstart' in window) {

            var startDrag;

            startDrag = function (e) {
                
                function moveDrag(e) {
                    if (e.touches.length === 1) {
                        var currentPos = getCoors(e);
                        _this.slide({ x : positioning[0] + (currentPos[0] - origin[0]), y : positioning[1] + (currentPos[1] - origin[1])});
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
                var positioning = [_this.view.left, _this.view.top];
                //var initialPosition = self.position();
            };

            $(config.system.pathSelector)[0].ontouchstart = startDrag;

        } else {

            // Add a classname for desktop browsers.
            // This allows us to use hover styles only when useful.
            document.body.className += " desktop";

            $(config.system.pathSelector)
                .bind('mousewheel', function (e, delta) {
                    e.preventDefault();

                    // Windows browsers seem to return very small values in the
                    // delta property, so let's make that something more sensible.
                    if (navigator.appVersion.indexOf("Win") != -1) {
                        if ((delta > 0 && delta <= 10) ||
                            (delta < 0 && delta >= -10)) {
                            delta *= 10;
                        }
                    }
                    // invoke the moveRelative method..
                    _this.slideVertical(delta, 'rel');

                })
                .bind('mousedown', function (e) {

                    // on mouse down, we take the current Y position.
                    if (!$(e.target).is('div.node')) {

                        $('body').css('cursor', 'all-scroll');

                        e.preventDefault();
                        var startY = e.clientY;
                        var startX = e.clientX;

                        var lastY = 0;
                        var lastX = 0;
                        // then bind a function to mousemove...
                        $(document).bind('mousemove', function (e) {
                            e.preventDefault();
                            // where we move, taking into account the values from the last tick..
                            var newY = (lastY - (e.clientY - startY)) * -1;
                            var newX = (lastX - (e.clientX - startX)) * -1;

                            _this.slide({ x: newX, y : newY}, 'rel');

                            // then save for next time...
                            lastY = e.clientY - startY;
                            lastX = e.clientX - startX;

                        });

                        $(document).bind('mouseup', function (e) {
                            // or we unbind.
                            $(this).unbind('mousemove');
                            $('body').css('cursor', 'default');
                        });

                    }
                });
        }


    },

    slideHorizontal : (function (){
        // hide the internal position value in a closure
        var pos = 0;


        return function (val, rel) {

            var data = this.view.horizontal;

            if (!this.view.left){
                this.view.left = 0;
            }

            if (rel && rel === "rel") {
                val = val + this.view.left;
            }

            if (arguments.length > 0) {

                if (val > data.min) {
                    pos = 0;
                } else if (val < data.max) {
                    pos = data.max;
                } else {
                    pos = Math.floor(val);
                }

                this.position({ x : pos});

            } else {

                return pos;

            }
        };
    })(),

    slideVertical : (function (){
        // hide the internal position value in a closure
        var pos = 0;

        return function (val, rel) {

            var data = this.view.vertical;

            if (!this.view.top){
                this.view.top = 0;
            }

            if (rel && rel === "rel") {
                val = val + this.view.top;
            }

            if (arguments.length > 0) {

                if (val > data.min) {
                    pos = 0;
                } else if (val < data.max) {
                    pos = data.max;
                } else {
                    pos = Math.floor(val);
                }

                this.position({ y : pos});

            } else {

                return pos;

            }
        };

    })(),

    slide : function (obj, rel){
        var val;
        var pos = {};
        var data;

        if(typeof obj.x === 'number'){

            val = obj.x;

            data = this.view.horizontal;

            if (!this.view.left){ this.view.left  = 0;}

            if (rel) {
                val = val + this.view.left;
            }


            if (val > data.min) {
                pos.x = 0;
            } else if (val < data.max) {
                pos.x = data.max;
            } else {
                pos.x = val;
            }

        }

        if(typeof obj.y === 'number'){

            val = obj.y;

            data = this.view.vertical;

            if (!this.view.top){ this.view.top = 0; }

            if (rel) {
                val = val + this.view.top;
            }

            if (val > data.min) {
                pos.y = 0;
            } else if (val < data.max) {
                pos.y= data.max;
            } else {
                pos.y = val;
            }

        }

        if (arguments.length > 0){

            this.position(pos);

        } else {
            return pos;
        }

    },

    position : (function (){

        var currentX = 0, currentY = 0;
        var newX = 0, newY = 0;
        var identity = mat4.create();
        var updatePosition = function(){};
        var update = function (){

            if(currentX !== newX || currentY !== newY){

                updatePosition();

            }

            raf(update);
        };

        if(raf){

            raf(update);

        }

        return function (obj){

            var _this = this;

            if (!currentX){ currentX = _this.view.left; }
            if (!currentY){ currentY = _this.view.top; }

            newX = (typeof obj.x === 'number' ? obj.x : currentX);
            newY = (typeof obj.y === 'number' ? obj.y : currentY);

            updatePosition = function(){

                if (transform && transform.matrix3d){
                    var transformed = mat4.create();
                    var vec = vec3.fromValues(newX, newY,0);
                    mat4.translate(transformed, identity, vec);

                    _this.viewContainer.css('transform', applyMatrix(transformed));

                } else {
                   

                    _this.viewContainer.css('left', newX);
                    _this.viewContainer.css('top', newY);

                }

                _this.horizontalScrollbar.value( newX);
                _this.view.left = currentX = newX;
                _this.verticalScrollbar.value( newY);
                _this.view.top = currentY = newY;
                

                return this;

            };

            if(!raf){

                updatePosition();
            }


        };

    })()

};


module.exports = PathwaysVisualiser;