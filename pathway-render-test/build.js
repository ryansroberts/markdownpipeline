(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/********************************************************************
*
* Filename:     config.js
* Description:  contains default configs for all objects used in pathways
*   
********************************************************************/


module.exports = {
    system : {
        pathSelector: "#npw-path-layer",
        defaultURI : '',
        styles : {
            edge : {
                //strokeColor: "#c0c8d1",
                strokeColor: "rgb(85,85,85)",
                fillType: "none",
                strokeType: "line",
                strokeWidth: 1
            },
            icon : {
                //strokeColor: "#c0c8d1",
                strokeColor: "#fff",
                fillType: "none",
                strokeType: "line",
                strokeWidth: 3
            },
            label : {
                strokeColor: "#ccc",
                strokeType: "line",
                fillType: "fill",
                fillColor: "#fff",
                strokeWidth: 0.5
            },
            interactiveNormal : {
                strokeColor: "#fc9503",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#ffffff",
                gradientColor2: "#f8f9fb",
                strokeWidth: 3
            },
            interactiveHighlight : {
                strokeColor: "#4ea5bc",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#d4eaf0",
                gradientColor2: "#99c5d0",
                strokeWidth: 3
            },
            interactiveSelect : {
                strokeColor: "#07324e",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#176a9e",
                gradientColor2: "#0c4062",
                strokeWidth: 3
            },
            generic : {
                strokeColor: "#a9b0b6",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#ffffff",
                gradientColor2: "#f8f9fb",
                strokeWidth: 3
            },
            pathReferenceDecoration : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#fcb700",
                gradientColor2: "#fb7303",
                strokeWidth: 0
            },
            pathReferenceDecorationHighlight : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#4eaec8",
                gradientColor2: "#1a809b",
                strokeWidth: 0
            },
            interactiveDecoration : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#fcb700",
                gradientColor2: "#fb7303",
                strokeWidth: 0
            },
            interactiveDecorationHighlight : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#99c5d0",
                gradientColor2: "#d4eaf0",
                strokeWidth: 0
            },
            monochromeInteractive : {
                strokeColor: "#878787",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#ffffff",
                gradientColor2: "#F9F9F9",
                strokeWidth: 3

            },
            monochromePathReference : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#C1C1C1",
                gradientColor2: "#878787",
                strokeWidth: 0
            },
            monochromeGenericPathReference : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#a9b0b6",
                gradientColor2: "#a9b0b6",
                strokeWidth: 0
            }
        }
    }       
};

},{}],2:[function(require,module,exports){
var PathView = require('./visualiser/path-view.js');

$.get('result.json', function (data){

  var $context = $('#map-render');

  var pathView = new PathView(data, $context, false, 1);
  pathView.render();

});
},{"./visualiser/path-view.js":10}],3:[function(require,module,exports){
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




},{}],4:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val;
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":14}],5:[function(require,module,exports){
var jade = require('jade/lib/runtime.js');module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="modal-overlay"><div class="modal-content js-modal">');
if ( (title))
{
buf.push('<h1 class="modal-title">' + escape((interp = title) == null ? '' : interp) + '</h1>');
}
buf.push('<div class="js-content"></div>');
if ( (buttons.length))
{
buf.push('<div class="modal-controls">');
// iterate buttons
;(function(){
  if ('number' == typeof buttons.length) {

    for (var $index = 0, $$l = buttons.length; $index < $$l; $index++) {
      var button = buttons[$index];

buf.push('<button');
buf.push(attrs({ "class": ('btn') + ' ' + ('js-button') + ' ' + (button.className) }, {"class":true}));
buf.push('>' + escape((interp = button.text) == null ? '' : interp) + '</button>');
    }

  } else {
    var $$l = 0;
    for (var $index in buttons) {
      $$l++;      var button = buttons[$index];

buf.push('<button');
buf.push(attrs({ "class": ('btn') + ' ' + ('js-button') + ' ' + (button.className) }, {"class":true}));
buf.push('>' + escape((interp = button.text) == null ? '' : interp) + '</button>');
    }

  }
}).call(this);

buf.push('</div>');
}
buf.push('</div></div>');
}
return buf.join("");
}
},{"jade/lib/runtime.js":4}],6:[function(require,module,exports){
module.exports = modal

/*
 * This module provides generic modal dialog functionality
 * for blocking the UI and obtaining user input.
 *
 * Usage:
 *
 *   modal([options])
 *     [.on('event')]...
 *
 *   options:
 *     - title (string)
 *     - content (jQuery DOM element / raw string)
 *     - buttons (array)
 *       - text (string) the button text
 *       - event (string) the event name to fire when the button is clicked
 *       - className (string) the className to apply to the button
 *       - keyCodes ([numbers]) the keycodes of shortcuts key for the button
 *       - clickOutsideToClose (boolean) whether a click event outside of the modal should close it
 *       - clickOutsideEvent (string) the name of the event to be triggered on clicks outside of the modal
 *
 *  Events will be fired on the modal according to which button is clicked.
 *  Defaults are confirm/cancel, but these can be overriden in your options.
 *
 *  Example:
 *
 *   modal(
 *     { title: 'Delete object'
 *     , content: 'Are you sure you want to delete this object?'
 *     , buttons:
 *       [ { text: 'Don\'t delete', event: 'cancel', className: '' }
 *       , { text: 'Delete', event: 'confirm', className: 'danger' }
 *       ]
 *     })
 *     .on('confirm', deleteItem)
 */

var Emitter = require('events').EventEmitter
  , template = require('./modal-template')

  , defaults =
    { title: 'Are you sure?'
    , content: 'Please confirm this action.'
    , buttons:
      [ { text: 'Cancel', event: 'cancel', className: '', keyCodes: [ 27 ] }
      , { text: 'Confirm', event: 'confirm', className: 'btn-primary' }
      ]
    , clickOutsideToClose: true
    , clickOutsideEvent: 'cancel'
    , className: ''
    , fx: true // used for testing
    }

function modal(options) {
  return new Modal($.extend({}, defaults, options))
}

function Modal(settings) {

  Emitter.call(this)

  var el = $(template(settings))
    , modal = el.find('.js-modal')
    , content = el.find('.js-content')
    , buttons = el.find('.js-button')
    , keys = {}
    , transitionFn = $.fn.transition ? 'transition' : 'animate'

  if (typeof settings.content === 'string') {
    content.append($('<p/>', { text: settings.content }))
  } else {
    content.append(settings.content)
  }

  modal.addClass(settings.className)

  // Cache the button shortcut keycodes
  $.each(settings.buttons, function (i, button) {
    if (!button.keyCodes) return
    $.each(button.keyCodes, function (n, keyCode) {
      keys[keyCode + ''] = i
    })
  })

  /*
   * Reposition the modal in the middle of the screen
   */
  function centre() {
    if (modal.outerHeight(true) < $(window).height()) {
      var diff = $(window).height() - modal.outerHeight(true)
      modal.css({ top: diff / 2 })
    }
  }

  /*
   * Remove a modal from the DOM
   * and tear down its related events
   */
  var removeModal = $.proxy(function () {
    var listenersWithCallback = 0

    $.each(this.listeners('beforeClose'), function(i, fn) {
      if (isFunctionWithArguments(fn)) {
        listenersWithCallback++
      }
    })

    if (listenersWithCallback > 0) {
      var currentCallsCount = 0
        , performClose = function() {
          if (++currentCallsCount === listenersWithCallback) {
            performRemoveModal()
          }
        }
      this.emit('beforeClose', performClose)
    } else {
      this.emit('beforeClose')
      performRemoveModal()
    }
  }, this)

  function isFunctionWithArguments(fn) {
    return fn.length > 0
  }

  var performRemoveModal = $.proxy(function () {
    el[transitionFn]({ opacity: 0 }, settings.fx ? 200 : 0)
    // Do setTimeout rather than using the transition
    // callback as it potentially fails to get called in IE10
    setTimeout(function () {
      el.remove()
    }, settings.fx ? 200 : 0)
    modal[transitionFn]({ top: $(window).height() }, settings.fx ? 200 : 0)
    this.emit('close')
    this.removeAllListeners()
    $(document).off('keyup', keyup)
    $(window).off('resize', centre)
  }, this)

  // Expose so you can control externally
  this.close = function() {
    removeModal()
  }

  // Expose so you can recentre externally
  this.centre = centre

  /*
   * Respond to a key event
   */
  var keyup = $.proxy(function (e) {
    var button = keys[e.keyCode + '']
    if (typeof button !== 'undefined') {
      this.emit(settings.buttons[button].event)
      removeModal()
    }
  }, this)

  // Assign button event handlers
  buttons.each($.proxy(function (i, el) {
    $(el).on('click', $.proxy(function () {
      this.emit(settings.buttons[i].event)
      removeModal()
    }, this))
  }, this))

  $(document).on('keyup', keyup)

  // Listen for clicks outside the modal
  el.on('click', $.proxy(function (e) {
    if ($(e.target).is(el)) {
      this.emit(settings.clickOutsideEvent)
      // Clicks outside should close?
      if (settings.clickOutsideToClose) {
        removeModal()
      }
    }
  }, this))

  // Set initial styles
  el.css({ opacity: 0 })
  modal.css({ top: '0%' })

  // Append to DOM
  $('body').append(el)

  // transition in
  el[transitionFn]({ opacity: 1 }, settings.fx ? 100 : 0)

  if (modal.outerHeight(true) < $(window).height()) {
    var diff = $(window).height() - modal.outerHeight(true)
    modal[transitionFn]({ top: (diff / 2) + 10 }, settings.fx ? 200 : 0, function () {
      modal[transitionFn]({ top: diff / 2 }, settings.fx ? 150 : 0)
    })
  }

  $(window).on('resize', centre)

}

// Be an emitter
Modal.prototype = Emitter.prototype

},{"./modal-template":5,"events":15}],7:[function(require,module,exports){
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

},{"./label.js":8,"./point.js":11,"./vector-processing-and-bounding-box.js":13}],8:[function(require,module,exports){
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


},{}],9:[function(require,module,exports){
/********************************************************************
*
* Filename:     Nodes.js
* Description:  For creating and processing nodes
*   
********************************************************************/

    var planet = require('../lib/planet.js');

    var modal = require('modal');
    
    var appConfig = require('../core/config.js');
    //var broker = require('../framework/pubsub.js');

    var Vector2D = require('./vector-processing-and-bounding-box.js').Vector2D;
    var BoundingBox = require('./vector-processing-and-bounding-box.js').BoundingBox;
    var Point = require('./point.js');

    function PathNode (config, testLayer, isPrint){

        var _this = this,
            content,
            anchor,
            testWidth;

        if (config.shortContent !== '') {

            content = config.shortContent;

        } else {

            content = config.title;

        }


        this.anchor = $('<a></a>');
        this.anchor
            .addClass('node')
            .addClass(config.type)
            .addClass((isPrint ? 'print test' : 'web'))
            .html('<div>' + config.shortContent + '</div>');

        if (config.fullContent !== '') {

            this.anchor
                .attr('href', '#content=view-node%3A' + config.id)
                .attr('title', 'View full content for \'' + $.trim(config.title) + '\'');

            config.type = 'interactive';

            if ($(config.fullContent).find('a[rel="/rels/view-fragment/quality-statement"]').length){

                this.anchor.find('div.shortcontent').prepend($('<span class="icon-stack"><span class="icon-stack-base icon-nice-circle"></span><span class="icon-nice-standards"></span></span>'));

            }

        } else if (config.links && config.links[0]) {

            this.anchor.attr('href', config.links[0]);

            if (config.type === 'offmapreference') {

                this.anchor.attr('title', 'View the \'' + $.trim(config.title) + '\' path');

            } else {

                this.anchor.attr('title', 'View the \'' + $.trim(config.title) + '\' node');

            }

        }

        if ((config.type === "offmapreference" || config.type === "nodereference")) {
            this.anchor.append('<div class="path-reference"></div>');
        }

        this.htmlFragment = this.anchor;

        this.htmlFragment.css({ width: config.geometry.width, height: config.geometry.height });

        this.AABB = new BoundingBox(
                new Vector2D(config.geometry.left, config.geometry.top),
                new Vector2D(config.geometry.width, config.geometry.height));

        if (config.type === 'offmapreference' || config.type === 'nodereference' || config.fullContent !== '') {

            config.isInteractive = true;
            this.anchor.addClass('interactive');

        } else {
            config.isInteractive = false;
            this.anchor.addClass('static');

        }


        $.extend(this, config);

        return this;

    }

    PathNode.prototype = {

        draw: function(context, textLayer, scale) {

            if (!scale) {

                scale = 1;

            }

            var styles = appConfig.system.styles, width = (this.AABB.size().x * scale), height = (this.AABB.size().y * scale), _this = this;

            this.htmlFragment
                .css({
                    left: this.AABB.x * scale,
                    top: this.AABB.y * scale,
                    width: width,
                    height: height,
                    position: 'absolute',
                    //'font-size': scale + "em"
                })
                .appendTo(textLayer)
                //.append('<div class="node-order node-order-number web">' + this.nodeOrder + '</div>');
            /*
            if (this.anchor.attr('href')) {
                var slug = this.anchor.attr('href').replace(/-/g, ' ').replace(/\/pathways\//g, ' ');
                slug = slug.replace(/\#content=view node%3Anodes/g, '');
                this.htmlFragment.append('<div class="slug-refs web" id="slugRefsWeb' + this.nodeOrder + '">' + this.nodeOrder + ' - <a href=' + this.anchor.attr('href') + '>' + slug + '</a></div>');
            } else {
                this.htmlFragment.append('<div class="slug-refs web" id="slugRefsWeb' + this.nodeOrder + '">' + this.nodeOrder + ' - N/A</div>');
            }
    */

            var $fullContent = $(this.fullContent);
            
            this.htmlFragment.bind('click', (function (e) {

                e.preventDefault();

                modal(
                  { 
                    title : '',
                  content: $fullContent
                  , buttons:
                    [ { text: 'Done', event: 'done', classname: '' }
                    ]
                  })
                  .on('done', function(){})
                //broker.publish("node-clicked", this);

            }).bind(this));

            $('a',$fullContent).click(function (e){

                window.location.href = "http://ld.local:8030/index.html#/evidence-statements/" + $(this).attr('href');
                e.preventDefault();

            });
 

            return;
        },
        // responds to external events
        drawAsSelected: function (context, scale) {

            this.htmlFragment.addClass('selected');


        },
        // responds to external events
        drawAsHighlighted: function (context, scale) {


        },

        drawForPrint: function (context, textLayer, scale) {

            if (!scale) {

                scale = 4;

            }

            var styles = appConfig.system.styles,
                width = (this.AABB.size().x * scale),
                height = (this.AABB.size().y * scale),
                nodeOrder,
                _this = this,
                c,
                p,
                w, h;

            this.htmlFragment
                .css({

                    left: this.AABB.x * scale,
                    top: this.AABB.y * scale,
                    width: (this.type === 'interactive' ? width - 20 : width),
                    height: height,
                    position: 'absolute',
                    'font-size': "2.85em"

                })
                .addClass('print')
                .appendTo(textLayer);


            nodeOrder = $('<div class="node-order">' + this.nodeOrder + '</div>');
            nodeOrder.css({ 'font-size': "2.7em" });
            textLayer.append(nodeOrder);


            if (this.type === 'offmapreference' || this.type === 'nodereference') {

                nodeOrder.css({
                    left: (this.AABB.x + 8) * scale,
                    top: (this.AABB.y + (height / scale) - 26) * scale,
                    'padding-top': "1em",
                    color : '#fff'

                });

                // draw the pathways logo with vector graphics for path references.
                c = $('div.path-reference', this.htmlFragment);
                w = 704;
                h = 68;

                c.css({
                    width: w,
                    height: h,
                    position: 'absolute',
                    bottom: 14,
                    left: 0
                });

            } else {

                this.htmlFragment.css({

                    left: (this.AABB.x + 8) * scale,
                    width: (width) - (7 * scale),
                    fontSize: '2.7em'

                });

                nodeOrder.css({
                    left: (this.AABB.x - 4) * scale,
                    top: (this.AABB.y) * scale,
                    /* 'padding-top': '1.2em', */
                    width: 'auto',
                    'text-align' : 'right',
                    color : '#000'
                });

            }

            return;

        },

        getConnectorPoint: function (vector) {

            var box = this.AABB;


            var cx = box.x + box.hw;
            var cy = box.y + box.hh;

            return new Point({ x: (cx + (box.hw * vector.x)), y: (cy + (box.hh * vector.y)) }, vector);

        },

        registerEvent: function (event, callback) {

            this.htmlFragment.bind(event, callback);

        }

    };

    function drawBox (c, x, y, w, h) {

        c.box({
            position: {
                x: x,
                y: y
            },
            size: {
                w: w,
                h: h
            },
            cornerRadius: 0.1

        });

    }

    function drawLine (c, x1, y1, x2, y2) {

        c.path({
            points: [
                {
                    x: x1,
                    y: y1

                },
                {
                    x: x2,
                    y: y2

                }
            ]

        });

    }

    module.exports = PathNode;


},{"../core/config.js":1,"../lib/planet.js":3,"./point.js":11,"./vector-processing-and-bounding-box.js":13,"modal":6}],10:[function(require,module,exports){
/********************************************************************
*
* Filename:     Path-view.js
* Description:  
*   
********************************************************************/

var planet = require('../lib/planet.js');

//var browser = require('../utils/sniffer.js');
//var broker = require('../framework/pubsub.js');
//var httpLinkCache = require('../core/httpLinkCache.js');
var appConfig = require('../core/config.js');

var Vector2D = require('./vector-processing-and-bounding-box.js').Vector2D;
var BoundingBox = require('./vector-processing-and-bounding-box.js').BoundingBox;
var QuadTree = require('./quadtree.js').QuadTree;

var PathNode = require('./path-node.js');

var processEdgeGroups = require('./edge.js').processEdgeGroups;
var createEdgeGroups = require('./edge.js').createEdgeGroups;

var canvasMargin = 50;

function PathView (data, context, isPrint, scale){

    context.addClass('path-view-container');

    this.context = context;
    this.properties = {};
    this.nodes = {};
    this.scale = (scale ? scale : 2);
    

    this.edges = {};
    this.selectedNode = '';
    this.uid = data.pathwaySlug;
    this.isPrint = (isPrint === 'print' ? true : false);

    this
        .createDefaultLayers()
        .initialisePathAndNodes( data.nodes )
        .initialiseLayers()
        .initialiseEdges( data.edges )
        .initialiseLabels( data.labels );

    return this;

}

PathView.prototype = {

    render : function (){

        var _this = this;
        
        $.each(this.nodes, function (id, node){
            
            node.draw(_this.planetLayer, _this.textLayer, _this.scale);
            /*
            if(node.isInteractive){

                // click handlers for links...
                if(node.type === 'interactive'){
                    
                    node.registerEvent('click', (function (id){

                        return function (e){
                        
                        e.preventDefault();
                        broker.publish("request-view-node-content", id);

                        };

                    }(node.id)) );

                }else if(node.type === 'offmapreference' && typeof node.links!== 'undefined'){

                    node.registerEvent('click', (function (link){

                        return function (e){
                            
                            e.preventDefault();

                            var xmlUri = httpLinkCache[link].xml;

                            broker.publish("request-view-new-path", xmlUri, link);

                        };

                    }(node.links[0])));


                }else if(node.type === 'nodereference'){

                    node.registerEvent('click', (function (id){

                        return function (e){
                        
                            broker.publish('event-application-is-loading');
                            window.location = $(this).attr('href');
                        };

                    }(_this.id) ) );

                }

                if(!('ontouchstart' in window)){

                    // now bind mouseenter/mouseleave events...
                    node.registerEvent('mouseenter', function (e){
                            
                        node.drawAsHighlighted(_this.highlights, _this.scale);

                    });

                    node.registerEvent('mouseleave', function (e){

                        _this.highlights.clear();

                    });

                    node.registerEvent('mousedown', function (e){

                         node.moused = (new Date()).getTime();

                    });

                    node.registerEvent('focus', function (e){

                        if(node.moused){

                            if(node.moused < (new Date()).getTime() + 100){

                                $(this).trigger('click');

                            }else{

                                this.moused = false;

                            }


                        }else{
                        
                            broker.publish("event-center-on-node", node.id);

                        }

                    });
                }

            }
            */
            
        });

        this.drawEdgesAndLabels();

    },

    renderForPrint : function (){
        
        var _this = this;
        
        $.each(this.nodes, function (id, node){
            
            node.drawForPrint(_this.planetLayer, _this.textLayer, _this.scale);
    
        });

        _this.textLayer.css({
            position: 'absolute',
            top : 0,
            left : 0,
            overflow: 'hidden'            
        })


        this.drawEdgesAndLabels( );

    },

    drawEdgesAndLabels : function ( ){
        
        var groups = this.edgegroups, groupIndex = 0, edgeIndex = 0, labelIndex;

        var edgeStyle = appConfig.system.styles.edge;
        var edgeWidth = edgeStyle.strokeWidth;
        edgeStyle.strokeWidth = edgeWidth * this.scale;
        
        this.planetLayer.setDrawAttributes(appConfig.system.styles.edge);

        edgeStyle.strokeWidth = edgeWidth;

        while(groupIndex < groups.length){
            
            if(groups[groupIndex]){
                edgeIndex = 0;
                labelIndex = 0;

                if(groups[groupIndex].edges){

                    while(edgeIndex < groups[groupIndex].edges.length){
                    
                        groups[groupIndex].edges[edgeIndex].draw( this.planetLayer, this.scale );

                        edgeIndex++;
                        
                    }

                }

                if(groups[groupIndex].labels){

                    while(labelIndex < groups[groupIndex].labels.length){
                    
                        groups[groupIndex].labels[labelIndex].draw( this.textLayer, this.scale );

                        labelIndex++;
                        
                    }

                }
            }
            groupIndex++;

        }
    },

    hide : function (){
        
        this.container.hide();

    },

    show : function (){
        
        this.container.show();

    },

    createDefaultLayers : function (){
        
        this.container = $('<div id="/path-view/' + this.uid + '"></div>');

        if(this.isPrint){
            
            this.container.addClass('print');

        }

        this.vectorLayer = $('<div class="path-view-vector"></div>');
        //this.highlightLayer = $('<div class="path-view-highlight"></div>');
        //this.selectedLayer = $('<div class="path-view-select"></div>')
        this.textLayer = $('<div class="path-view-html"></div>');

        this.context
                .append(this.container);
        this.container
                .append(this.vectorLayer)
        //      .append(this.highlightLayer)
        //      .append(this.selectedLayer)
                .append(this.textLayer);

        return this;

    },

    initialiseLayers: (function (){
        
        var setSize = function (layers, width, height, scale){
            
            $.each(layers, function (key, value){
                
                value.css({
                    
                    width: width * scale ,
                    height: height * scale

                });

            });

        };

        return function (){

            setSize([this.vectorLayer, this.textLayer], this.properties.pathWidth, this.properties.pathHeight, this.scale);

            this.planetLayer = planet(this.vectorLayer);
            this.highlights = planet(this.vectorLayer);
            this.selects = planet(this.vectorLayer);
            
            return this;

        };

    }()),

    initialisePathAndNodes : function ( data ){
        
        var _this = this,
            maxWidth = 0,
            maxHeight = 0,
            geometry;

        data.forEach(function (node){
            // create the node object
            node.geometry.width += node.geometry.width;
            node.geometry.height += node.geometry.height;

            node.geometry.top -= (node.geometry.height * 0.5);
            node.geometry.left -= (node.geometry.width * 0.5)
            //
            node.geometry.top += canvasMargin;
            node.geometry.left += canvasMargin;



            _this.nodes[node.id] = new PathNode( node, _this.textLayer, _this.isPrint);
        
            // collapse the reference
            geometry = _this.nodes[node.id].AABB;

            // update maxWidth/maxHeight if necessary
            if(maxWidth < ((geometry.hw * 2) + geometry.x + 50)){
                
                maxWidth = ((geometry.hw * 2) + geometry.x + 50);

            }
            if(maxHeight < ((geometry.hh * 2) + geometry.y + 100)){

                maxHeight = ((geometry.hh * 2) + geometry.y + 100);

            }


        });

        this.properties.pathWidth = maxWidth;
        this.properties.pathHeight = Math.max(400, maxHeight);

        this.spatialIndex = new QuadTree( {
                                AABB: new BoundingBox(
                                        new Vector2D(0, 0),
                                        new Vector2D(this.properties.pathWidth, this.properties.pathHeight)
                                        )});

        $.each(this.nodes, function (id, node){
            
            _this.spatialIndex.push( {AABB : node.AABB, data: node} );

        });

        return this;

    },

    initialiseEdges : function ( edges ){

        var dimTest;

        edges.forEach(function (edge){

            if(edge.label !== ""){

                dimTest = $('<div class="label" id="label-dim-test">' + edge.label + '</div>');
                    $('body').append(dimTest);

                    edge.labelGeometry = {
                        height: dimTest.outerHeight(),
                        width: dimTest.outerWidth(),
                        innerWidth: dimTest.outerWidth() - (parseInt(dimTest.css("padding-left"), 10) + parseInt(dimTest.css("padding-right"), 10)),
                        innerHeight: dimTest.innerHeight() - (parseInt(dimTest.css("padding-top"), 10) + parseInt(dimTest.css("padding-bottom"), 10))
                    };

                    if (edge.labelGeometry.width > 150) {

                        // we restrict it's width and measure it again..
                        dimTest.css("display", "block").css("width", "150px");

                        edge.labelGeometry = {
                            height: dimTest.outerHeight(),
                            width: dimTest.outerWidth(),
                            innerWidth: dimTest.outerWidth() - (parseInt(dimTest.css("padding-left"), 10) + parseInt(dimTest.css("padding-right"), 10)),
                            innerHeight: dimTest.innerHeight() - (parseInt(dimTest.css("padding-top"), 10) + parseInt(dimTest.css("padding-bottom"), 10))
                        };

                    }

                    dimTest.remove();

            }

        });
        
        this.edgegroups = processEdgeGroups( createEdgeGroups( edges, this.nodes ), this.spatialIndex );

        return this;

    },

    getNodeGeometry : function ( nodeid ){
        
        if(this.nodes[nodeid]){
            
            return this.nodes[nodeid].AABB;

        }

    },

    initialiseLabels : function (){
        
        return this;

    },

    resetView : function (){
        
        // get rid of all highlighting and selecting.

        return this;

    },

    selectNode : function (id){
        
        // we only want one selected node..

        var _this = this;

        if(this.nodes[id]){

            if(this.selectedNode!== id){
                
                if(this.nodes[this.selectedNode]){
                    this.selects.clear();
                    this.nodes[this.selectedNode].htmlFragment.removeClass('selected');
                }

                this.selectedNode = id;

                this.nodes[id].drawAsSelected(this.selects, this.scale);

            }

        } else {

            if(this.nodes[this.selectedNode]){
                this.selects.clear();
                this.nodes[this.selectedNode].htmlFragment.removeClass('selected');
                this.selectedNode = false;
            }

        }

        return this;

    },

    getLandingNodeId : function (){

        var highestNode = null;

        for(var i in this.nodes){ 
            if(this.nodes.hasOwnProperty(i)){

                if (!highestNode || this.nodes[i].geometry.top < highestNode.geometry.top){
                    highestNode = this.nodes[i];
                }

                if(this.nodes[i].type==="landing"){ 
                    return this.nodes[i].id;
                }
            }
        }

        // not found a landing node? Return the id for the highest node in the page..

        return highestNode.id;

        return false;

    },

    clearDown : function (){
        
        this.context.empty();

    }

};

module.exports = PathView;

},{"../core/config.js":1,"../lib/planet.js":3,"./edge.js":7,"./path-node.js":9,"./quadtree.js":12,"./vector-processing-and-bounding-box.js":13}],11:[function(require,module,exports){
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


},{"./vector-processing-and-bounding-box":13}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){

},{}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[2])