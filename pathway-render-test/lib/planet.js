/*!
 * Planet v0.0.2 - a simple cross-platform path drawing library 
 * http://charlottegore.com
 *
 * Copyright 2010, Charlotte Gore
 * Licensed under the MIT license.
 *
 *
 * Date: Tue Jul 12 14:10:01 2011 +0100
 */ 
    var supportedModes = {
        vml : (function(){
        
            var doesSupport = 'untested';

            return function(){

                if(doesSupport==='untested'){

                    var a, b, headElement = document.getElementsByTagName("head")[0], styleElement, HTMLTagRef;
            
                    a = document.createElement('div');
                    a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
                    b = a.firstChild;
            
                    document.getElementsByTagName("body")[0].appendChild(a);
            
                    b.style.behavior = "url(#default#VML)";
            
                    doesSupport = b ? typeof b.adj === "object": true;
            
                    $(a).remove();
            
                    if(doesSupport){
                            headElement = document.getElementsByTagName("head")[0];
                            styleElement = document.createElement("style");
                            styleElement.type = "text/css";
                            headElement.appendChild(styleElement);
                            styleElement.styleSheet.cssText = "v\\:rect, v\\:roundrect,v\\:textbox, v\\:line, v\\:polyline, v\\:curve, v\\:arc, v\\:oval, v\\:image, v\\:shape, v\\:group, v\\:skew, v\\:stroke, v\\:fill { behavior:url(#default#VML); display:inline-block }";
    
                            HtmlTagRef = document.getElementsByTagName('HTML')[0];
                            HtmlTagRef.setAttribute('xmlns:v','urn:schemas-microsoft-com:vml');
                    
                            document.namespaces.add("v","urn:schemas-microsoft-com:vml");
    
                    }

                }
            
                return doesSupport;

            };
        }()),
        svg : function(){
            return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        },
        canvas : (function(){
            
            var doesSupport = 'untested';

            return function(){
                
                if(doesSupport==='untested'){

                    var elem = document.createElement('canvas');
                    if(elem.getContext && elem.getContext('2d')){
                        doesSupport = true;
                    }else{
                        doesSupport = false;
                    }

                }

                return doesSupport;

            };
        }())
    },
    
    planet;

    
    planet = function( selector, mode ){
        // selects VML, VML not supported: Try Canvas, then SVG, then abort
        // selects SVG, SVG not supported: Try VML, then Canvas, then abort
        // selects Canvas, Canvas not supported: Try VML, then SVG, then abort.
        
        var priority = ["canvas","svg","vml"], i, il;
        
        if(mode && supportedModes[mode]()){
            return new planet[mode].init( selector );
        }else{
            for(i = 0, il = priority.length; i < il ;i++){
            
                if(supportedModes[priority[i]]()){
                    return new planet[priority[i]].init( selector );
                }
            
            }
        }
    };
    
    planet.extend = function(){
        // Based on code in jQuery
        var target = this, i = 0, length = arguments.length, options, name, src, copy;
    
        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) !== null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
    
                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }
    
                    // Recurse if we're merging object literal values or arrays
                    if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
    
        // Return the modified object
        return target;
    };  
    
    planet.extend({
        defaultPen : {
                    strokeType : "none",
                    fillType : "none",
                    strokeWidth : 1,
                    strokeColor : "#000",
                    fillColor : "#000",
                    gradientColor1 : "#000",
                    gradientColor2 : "#FFF"
        },

        forceMode : function( mode ){
            
            if(mode==="vml" || mode==="svg" || mode==="canvas"){
                
                planet._mode = mode;

                return this;

            }

        },
    
        vml : {
            init : function( selector ){
            
                this.parent = $(selector);
                this.container = $('<div></div>'); 
                this.container.appendTo( this.parent );
                this.container.attr({
                    'width' : this.parent.width(),
                    'height' : this.parent.height()

                });
                this.mode = "vml";

                this.width = this.parent.width();
                this.height = this.parent.height();

                this.container.css('position', 'absolute');
                
                this.pen = {};
                this.pen.extend = planet.extend;
                this.pen.extend(planet.defaultPen);
                
                return this;
            }
        },
        svg : {
            init : function( selector ){
                // For SVG, we create an SVG element in the SVG namespace and append to the 
                // container, setting the size appropriately. 
                var svg, container = $(selector);
            
                this.svgNS = "http://www.w3.org/2000/svg";
                
                svg = document.createElementNS(this.svgNS, "svg");
                svg.setAttributeNS(null, "version", "1.1");
                svg.setAttributeNS(null, "style", "position:absolute;top:0;left:0");
                
                this.width = container.width();
                this.height = container.height();

                $(svg)
                    .css("width",this.width)
                    .css("height",this.height)
                    .css("position", 'absolute');
                
                this.container = $(svg);
                
                container.append(this.container);
                
                this.mode = "svg"; 
                
                this.pen = {};
                this.pen.extend = planet.extend;
                this.pen.extend(planet.defaultPen);
                return this;
            },
            createGradient : function( color1, color2 ){

                var id, gradient, child;

                if (planet.gradientUID){

                    planet.gradientUID++;

                } else {

                    planet.gradientUID = 1;

                }
                
                id = 'user-grad-' + planet.gradientUID;

                if(!this.defsContainer){
                
                    this.defsContainer = document.createElementNS(this.svgNS,'defs');
                    this.container.append(this.defsContainer);

                }

                gradient = document.createElementNS(this.svgNS, 'linearGradient');
                gradient.setAttributeNS(null, 'id', id);

                // need to calculate x1, x2, y1 and y2

                gradient.setAttributeNS(null, 'x1', '0%');
                gradient.setAttributeNS(null, 'y1', '0%');
                gradient.setAttributeNS(null, 'x2', '0%');
                gradient.setAttributeNS(null, 'y2', '100%');
                gradient.setAttributeNS(null, 'spreadMethod', 'pad');
                gradient.setAttributeNS(null, 'gradientUnits', 'objectBoundingBox');

                child = document.createElementNS(this.svgNS, 'stop');
                child.setAttributeNS(null, 'offset', '0%');
                child.setAttributeNS(null, 'stop-color', color1);
                
                $(gradient).append(child);

                child = document.createElementNS(this.svgNS, 'stop');
                child.setAttributeNS(null, 'offset', '100%');
                child.setAttributeNS(null, 'stop-color', color2);

                $(gradient).append(child);

                $(this.defsContainer).append(gradient);

                return id;

            }
        },
        canvas : {
            init : function( selector ){
                var canvas, container = $(selector);
                
                this.canvas = document.createElement("canvas");
                
                this.width = container.width();
                this.height = container.height();

                // Internet Exploder doesn't support devicePixelRatio
                // so let's set it if it's not already set.
                window.devicePixelRatio = window.devicePixelRatio || 1;

                $(this.canvas)
                    .attr('height', this.height * window.devicePixelRatio)
                    .attr('width', this.width * window.devicePixelRatio)
                    .css('height', this.height)
                    .css('width', this.width)
                    .css('position', 'absolute');

                container.append(this.canvas);
                
                this.container = this.canvas.getContext('2d');

                if(window.devicePixelRatio !== 1){

                    this.container.scale(window.devicePixelRatio, window.devicePixelRatio);

                }
                
                
                this.mode = "canvas";
                
                this.pen = {};
                this.pen.extend = planet.extend;
                this.pen.extend(planet.defaultPen);
                
                return this;
            }
        },
        getSupportedMethods : function(){
            var methods = [];
            
            if(isVMLSupported){
                methods.push("vml");
            }

            if(isSVGSupported){
                methods.push("svg");
            }
            
            
            if(isCanvasSupported){
                methods.push("canvas");
            }
            
            return methods;
        }
    });
    
    planet.vml.init.prototype = planet.vml;
    planet.svg.init.prototype = planet.svg;
    planet.canvas.init.prototype = planet.canvas;
    
    // hook extend into the various prototypes
    planet.svg.extend = planet.canvas.extend = planet.vml.extend = planet.extend;   

    var setDrawAttributes = {
        setDrawAttributes : function( obj ){

            this.pen.extend( obj );

            return this;
        }
    };
    
    planet.vml.extend(setDrawAttributes);
    planet.svg.extend(setDrawAttributes);
    planet.canvas.extend(setDrawAttributes);/* line.js */

  /* line.js */

    // usage: planetObject.line({x1 : number, y1 : number, x2 : number, y2 : number});

    var line = {
    
        line : function( obj ){
            // Basically a line is very short stroked path, making this is a shortcut to Path.
            this.path({
                points : [
                    {x : (obj.x1 + 0.5), y : (obj.y1 + 0.5)},
                    {x : (obj.x2 + 0.5), y : (obj.y2 + 0.5)}
                    
                ],
                close : false
            });
        
            return this;
        }
    
    };

    planet.vml.extend(line);
    planet.svg.extend(line);
    planet.canvas.extend(line);/*
    path.js
    
    usage: planetObj.path({startx : number, starty : number, points : [ {x : number, y : number}... ]})
*/

    
    
    
    planet.vml.extend({
    
        path : function( obj ){
        
            // This is where it starts to get fookin' hard.
            
            var path = "", width = this.width, height = this.height, i, il;
            
            var vEl = document.createElement('v:shape');
            
            $(vEl).attr('style', 'position: absolute; top: 0; left: 0; width:' + width + 'px; height: ' + height + 'px;' );
            $(vEl).attr('coordorigin', '0 0');
            $(vEl).attr('coordsize', width + ' ' + height);

            path = 'm '+Math.floor(obj.points[0].x)+','+Math.floor(obj.points[0].y)+' ';
            
            for(i = 1, il = obj.points.length; i < il ; i++){
                path += 'l '+Math.floor(obj.points[i].x)+','+Math.floor(obj.points[i].y) + ' ';
            }
            
            vEl.setAttribute('strokecolor', this.pen.strokeColor);
            vEl.setAttribute('strokeweight', this.pen.strokeWidth);

            if(this.pen.fillType !== "none" || obj.close===true){

                path += ' x e';

                if (this.pen.fillType === "fill") {

                    $(vEl).attr('fillcolor', this.pen.fillColor);

                } else if (this.pen.fillType === "gradient") {

                    $(vEl).attr('fillcolor', this.pen.gradientColor1);

                    var fill = document.createElement('v:fill');
                    $(fill).attr('type', 'gradient');
                    $(fill).attr('color2', this.pen.gradientColor2);
                    $(fill).attr('method', 'linear sigma');
                    $(fill).attr('angle', '180');

                    $(vEl).append(fill);

                }
            }else {
            
                vEl.setAttribute('filled', 'False');
                
            }
            
            
            vEl.setAttribute('path', path);
            
            this.container.append(vEl);

            
            return this;
        
        
        }
    
    });

        planet.svg.extend({
    
        path : function( obj ){
        
            var d = "M "+obj.points[0].x+" "+obj.points[0].y+" ", i, il;
            
            for(i = 1, il = obj.points.length; i < il ; i++){
                d += "L"+obj.points[i].x+" "+obj.points[i].y;
            }

            var shape = document.createElementNS(this.svgNS, "path");
            
            if(this.pen.fillType !== "none" || obj.close===true){
                d += "Z";

                if (this.pen.fillType === "fill") {

                    shape.setAttributeNS(null, "fill", this.pen.fillColor);

                } else if (this.pen.fillType === "gradient") {
                    var gradId = this.createGradient(this.pen.gradientColor1, this.pen.gradientColor2);
                    shape.setAttributeNS(null, "fill", "url(#" + gradId + ")");
                }

            }else {
            
                shape.setAttributeNS(null, "fill", "none");
                
            }
            
            
            shape.setAttributeNS(null, "stroke", this.pen.strokeColor);
            shape.setAttributeNS(null, "stroke-width", this.pen.strokeWidth + "px");    
            
            shape.setAttributeNS(null, "d", d);
            
            this.container.append(shape);   
            
            return this;
        
        }
    });
    
    planet.canvas.extend({
    
        path : function( obj ){
        
            this.container.beginPath();
        
            if(this.pen.fillType !== 'none'){
                this.container.fillStyle = this.pen.fillColor;
            }
            
            if(this.pen.strokeType !== "none"){
                this.container.lineWidth = (this.pen.strokeWidth);
                this.container.strokeStyle = this.pen.strokeColor;
                this.container.lineCap = 'round';
                
            }
        
            this.container.moveTo(obj.points[0].x  + 0.5, obj.points[0].y + 0.5);
            
            for(i = 1, il = obj.points.length; i < il ; i++){
                this.container.lineTo(obj.points[i].x + 0.5, obj.points[i].y + 0.5);
            }
            
            if(obj.close || this.pen.fillType !== 'none'){
                this.container.lineTo(obj.points[0].x + 0.5, obj.points[0].y + 0.5);
            }
            
            if(this.pen.fillType === "fill"){
                this.container.fill();
            }
            
            if(this.pen.strokeType !== "none"){
                this.container.stroke();
            }
            
            this.container.closePath();
            
            return this;
        
        }
        
    }); /* box.js */

planet.vml.extend({

    box: function (obj) {

        var path = "", px = [], py = [], p, vEl, width = this.width, height = this.height, i, il;

        vEl = document.createElement('v:shape');

        $(vEl).attr('style', 'position: absolute; top: 0; left: 0; width:' + width + 'px; height: ' + height + 'px;');
        $(vEl).attr('coordorigin', '0 0');
        $(vEl).attr('coordsize', width + ' ' + height);
        //style = 'style="position: absolute; top: 0; left: 0; width:' + width + 'px; height: ' + height + 'px;"';

        px[0] = obj.position.x;
        px[3] = px[0] + obj.size.w;

        py[0] = obj.position.y;
        py[3] = py[0] + obj.size.h;

        if (obj.cornerRadius) {

            if(typeof obj.cornerRadius==='number'){

                obj.cornerRadius = [obj.cornerRadius, obj.cornerRadius, obj.cornerRadius, obj.cornerRadius];

            }
            //px[1] = px[0] + obj.cornerRadius;
           // px[2] = px[3] - obj.cornerRadius;
            //py[1] = py[0] + obj.cornerRadius;
           // py[2] = py[3] - obj.cornerRadius;

            path += "m " + (px[0] + obj.cornerRadius[0]) + " " + py[0] + " ";
            path += "l " + (px[3] - obj.cornerRadius[1]) + " " + py[0] + " ";
            path += "qx " + px[3] + " " + (py[0] + obj.cornerRadius[1]) + " ";
            path += "l " + px[3] + " " + (py[3] - obj.cornerRadius[2])  + " ";
            path += "qy " + (px[3] - obj.cornerRadius[2]) + " " + py[3] + " ";
            path += "l " + (px[0] + obj.cornerRadius[3]) + " " + py[3] + " ";
            path += "qx " + px[0] + " " + (py[3] - obj.cornerRadius[3]) + " ";
            path += "l " + px[0] + " " + (py[0] + obj.cornerRadius[0]) + " ";
            path += "qy " + (px[0] + obj.cornerRadius[0]) + " " + py[0] + " ";

        } else {

            path += "m " + px[0] + " " + py[0] + " ";
            path += "l " + px[3] + " " + py[0] + " ";
            path += "l " + px[3] + " " + py[3] + " ";
            path += "l " + px[0] + " " + py[3] + " ";
            path += "l " + px[0] + " " + py[0] + " ";

        }



        if(this.pen.strokeType==='none'){
        
            var stroke = document.createElement('v:stroke');
                $(stroke).attr('on', 'False');

                $(vEl).append(stroke);

        }else{
            $(vEl).attr('strokeweight', this.pen.strokeWidth);
            $(vEl).attr('strokecolor', this.pen.strokeColor);


        }


        if (close === true || this.pen.fillColor !== "none") {

            path += ' x e';

            if (this.pen.fillType === "fill") {

                $(vEl).attr('fillcolor', this.pen.fillColor);

            } else if (this.pen.fillType === "gradient") {

                $(vEl).attr('fillcolor', this.pen.gradientColor1);

                var fill = document.createElement('v:fill');
                $(fill).attr('type', 'gradient');
                $(fill).attr('color2', this.pen.gradientColor2);
                $(fill).attr('method', 'linear sigma');
                $(fill).attr('angle', '180');

                $(vEl).append(fill);

            }

        } 

        $(vEl).attr('path', path);

        this.container.append(vEl);


        return this;

    }

});

    planet.svg.extend({

        box: function (obj) {

            var d = "", px = [], py = [], p;

            px[0] = obj.position.x;
            px[3] = px[0] + obj.size.w;

            py[0] = obj.position.y;
            py[3] = py[0] + obj.size.h;

            if (obj.cornerRadius) {

                if(typeof obj.cornerRadius==='number'){
            
                    obj.cornerRadius = [obj.cornerRadius, obj.cornerRadius, obj.cornerRadius, obj.cornerRadius];

                }

                d += "M " + (px[0] + obj.cornerRadius[0]) + " " + py[0] + " ";

                d += "L " + (px[3] - obj.cornerRadius[1]) + " " + py[0] + " ";
                d += "A " + obj.cornerRadius[1] + "," + obj.cornerRadius[1] + " 90 0,1 " + px[3] + "," + (py[0] + obj.cornerRadius[1]);

                d += "L " + px[3] + " " + (py[3] - obj.cornerRadius[2]);

                d += "A " + obj.cornerRadius[2] + "," + obj.cornerRadius[2] + " 90 0,1 " + (px[3] - obj.cornerRadius[2]) + "," + py[3];

                d += "L " + (px[0] + obj.cornerRadius[3]) + " " + py[3];
                d += "A " + obj.cornerRadius[3] + "," + obj.cornerRadius[3] + " 90 0,1 " + px[0] + "," + (py[3] - obj.cornerRadius[3]);

                d += "L " + px[0] + " " + (py[0] + obj.cornerRadius[0]);
                d += "A " + obj.cornerRadius[0] + "," + obj.cornerRadius[0] + " 90 0,1 " + (px[0] + obj.cornerRadius[0]) + "," + py[0];

            } else {

                d += "M " + px[0] + " " + py[0] + " ";
                d += "L " + px[3] + " " + py[0] + " ";
                d += "L " + px[3] + " " + py[3] + " ";
                d += "L " + px[0] + " " + py[3] + " ";
                d += "L " + px[0] + " " + py[0] + " ";


            }

            var shape = document.createElementNS(this.svgNS, "path");

            if (this.pen.fillType !== "none" || obj.close === true) {
                d += "Z";

                if (this.pen.fillType === "fill") {

                    shape.setAttributeNS(null, "fill", this.pen.fillColor);

                } else if (this.pen.fillType === "gradient") {
                    var gradId = this.createGradient(this.pen.gradientColor1, this.pen.gradientColor2);
                    shape.setAttributeNS(null, "fill", "url(#" + gradId + ")");
                }

            } else {

                shape.setAttributeNS(null, "fill", "none");

            }
            shape.setAttributeNS(null, "stroke", this.pen.strokeColor);
            shape.setAttributeNS(null, "stroke-width", (this.pen.strokeWidth + 1) + "px");


            shape.setAttributeNS(null, "d", d);

            this.container.append(shape);

            return this;
        }
    });
    
    planet.canvas.extend({
    
        box : function( obj ){

            var px = [], py = [], q = (Math.PI / 2);

            this.container.beginPath();

            px[0] = obj.position.x + 0.5;
            px[3] = px[0] + obj.size.w;
    
            py[0] = obj.position.y + 0.5;
            py[3] = py[0] + obj.size.h + 0.5;
    
            if (obj.cornerRadius) {

                if(typeof obj.cornerRadius==='number'){

                    obj.cornerRadius = [obj.cornerRadius, obj.cornerRadius, obj.cornerRadius, obj.cornerRadius];

                }
    
                this.container.moveTo(px[0] + obj.cornerRadius[0], py[0]);
    
                this.container.arc(px[3] - obj.cornerRadius[1], py[0] + obj.cornerRadius[1], obj.cornerRadius[1], q * 3, q * 4, 0);
                this.container.arc(px[3] - obj.cornerRadius[2], py[3] - obj.cornerRadius[2], obj.cornerRadius[2], q * 4, q * 5, 0);
                this.container.arc(px[0] + obj.cornerRadius[3], py[3] - obj.cornerRadius[3], obj.cornerRadius[3], q * 5, q * 6, 0);
                this.container.arc(px[0] + obj.cornerRadius[0], py[0] + obj.cornerRadius[0], obj.cornerRadius[0], q * 6, q * 7, 0);


            } 

            if(this.pen.fillType === "fill"){
                this.container.fillStyle = this.pen.fillColor;
                this.container.fill();
            }
            if(this.pen.fillType === "gradient"){
        
                var grad = this.container.createLinearGradient(0, obj.position.y, 0, obj.position.y + obj.size.h);
                grad.addColorStop(0, this.pen.gradientColor1);
                grad.addColorStop(1, this.pen.gradientColor2);
                
                this.container.fillStyle = grad;
                this.container.fill();
                
            }
            
            if(this.pen.strokeType !== "none"){
                this.container.lineWidth = (this.pen.strokeWidth);
                this.container.strokeStyle = this.pen.strokeColor;
                
                this.container.stroke();
            }
            
            this.container.closePath();
            
            return this;


        }
        
    });
/* outro.js */

    planet.vml.extend({
        
        clear : function(){
            
            this.container.empty();

        }

    });

    planet.svg.extend({
        
        clear : function(){
            
            this.container.empty();

        }
        
    });

    planet.canvas.extend({
        
        clear : function(){
            this.container.clearRect(0, 0, this.width, this.height);
            //var w = $(this.canvas).attr('width');
            //$(this.canvas).attr('width', 0).attr('width', w).css('background', 'none');

        }
        
    });

    module.exports = planet;



