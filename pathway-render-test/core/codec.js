/********************************************************************
*
* Filename:     codec.js
* Description:  contains methods for parsing the XML
*   
********************************************************************/

var httpLinkCache = require('./httpLinkCache.js');
var hash = require('../framework/hash.js');
var broker = require('../framework/pubsub.js');

module.exports.parseXML = function (xmlstring){

    var doc, xmluri, parsed;

    if (window.DOMParser) {
        parser = new DOMParser();
        doc = parser.parseFromString(xmlstring, "text/xml");
    } else {
        doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        doc.loadXML(xmlstring);
    }

    // wrapped for handy jQuery methods..
    $doc = $(doc);

    $path = $doc.find('path');

    // basic processing..

    parsed = {
        title :         $path.attr('title'),
        selfHttpURI :   $path.find('link[rel=self][type="text/html"]').attr('uri'),
        selfPDFURI :    $path.find('link[rel=self][type="application/pdf"]').attr('uri'),
        selfXMLURI :    $path.find('link[rel=self][type="application/vnd.nice.path+xml"]').attr('uri'),
        shortURI :      $path.find('link[rel=self][type="application/vnd.nice.path+xml"]').attr('shorturi'),
        pathwayTitle :  $path.find('link[rel=pathway][type="text/html"]').attr('title'),
        pathwaySlug :   $path.find('link[rel=pathway][type="text/html"]').attr('slug'),
        thumbURI :      $path.find('link[rel="/rels/view-thumbnail"][type="application/vnd.nice.path-thumbnail+xml"]').attr('shorturi'),
        iconURI :       $path.find('link[rel=icon]').attr('uri'),
        edges :         [],
        edgegroups :    [],
        nodes :         []
    };

    // more complex processing.. 

    $verts = $doc.find('node');

    $verts.each(function (){

        parseNodeXML($(this), parsed);

    });

    xmluri = parsed.selfXMLURI;

    if (!httpLinkCache[parsed.selfHttpURI]) {
        httpLinkCache[parsed.selfHttpURI] = {
            http: parsed.selfHttpURI,
            xml: parsed.selfXMLURI,
            title: parsed.title,
            shortURI: parsed.shortURI,
            rel: "/rels/view-path"
        };
    }

    // publish notification data about this path...
    broker.publish('updatePDFLink', parsed.selfPDFURI);
    broker.publish('New FAST Context Data', { pbu : parsed.selfHttpURI, pwbu : parsed.pathwaySlug });

    return parsed;

};

function parseFragment (str){
    if (!str) {
        return '';
    } else {
        str = str.toString().trim();
        return str;
    }
}

function parseNodeXML ($node, parsed){

    var node,
        $connections =      $node.find('link[rel*="/rels/connection/"]'),
        $pathreferences =   $node.find('link[rel*="/rels/view-path"][type="text/html"]'),
        $nodereferences =   $node.find('link[rel*="/rels/view-node"][type="text/html"]'),
        $geometry =         $node.find('geometry');

    node = {
        id:             $node.attr('id'),
        nodeOrder:      $node.attr('nodeorder'),
        title:          $node.find('title').text(),
        type:           $node.attr('type'),
        shortContent:   parseFragment($node.find('shortcontent').text()),
        fullContent:    parseFragment($node.find('fullcontent').text()),
        geometry: {
            width:  parseInt($geometry.attr('width'), 10),
            height: parseInt($geometry.attr('height'), 10),
            top:    parseInt($geometry.attr('top'), 10),
            left:   parseInt($geometry.attr('left'), 10)
        }
    };

    // search for edges... 
    $connections.each(function (){

        var $connection = $(this);

        var link = {
            rel: $connection.attr('rel') || 'default',
            uri: $connection.attr('uri') || ''
        };

        var rel = link.rel, matches = rel.match(/^\/rels\/connection\/([a-zA-Z\-]+)/);

        if (matches && matches[1]) {

            var edge = {
                source: node.id,
                target: link.uri.replace('#', ''),
                sourceSide: $connection.attr('sourceside') || "bottom",
                targetSide: $connection.attr('targetside') || "top",
                label: $connection.attr('label') || '',
                type: matches[1] === "arrow" ? "directional" : (matches[1]=== "two-arrows" ? "bi-directional" : "none")
            };

            edge.uid = edge.source + edge.sourceSide + edge.target + edge.targetSide;

            parsed.edges.push(edge);
        }
    });

    if (node.type==='offmapreference'){

        $pathreferences.each(function () {

            var $pathref = $(this);

            var link = {
                rel:    $pathref.attr('rel') || 'default',
                http:   $pathref.attr('uri') || '',
                title:  $pathref.attr('title') || '',
                type:   $pathref.attr('type')
            };

            var xmlLink = $node.find('link[type="application/vnd.nice.path+xml"][title="' + link.title + '"]');

            if (xmlLink.length > 0) {

                if (!httpLinkCache[link.http]) {
                    link.xml = xmlLink.attr('uri');
                    link.shortURI = xmlLink.attr('shorturi');
                    httpLinkCache[link.http] = link;
                }

                if (!node.links) {
                    node.links = [];
                }

                node.links.push(link.http);
            }

        });
    }

    if (node.type==="nodereference"){

        $nodereferences.each(function () {

                if (!node.links) {
                    node.links = [];
                }

                var bits = $(this).attr('uri').split('#');

                if (bits[0] && bits[1]){

                    var fragment = hash.getHashString({ handler : "content", command : "view-node", value : "nodes-" + bits[1] });

                    var http = bits[0] + fragment;

                    node.links.push(http);

                }

        }); 

    }

    parsed.nodes.push(node);

}
