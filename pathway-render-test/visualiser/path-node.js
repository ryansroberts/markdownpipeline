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

