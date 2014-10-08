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
