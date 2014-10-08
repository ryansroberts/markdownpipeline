var fs = require('fs');

var input = process.argv[2];
var output = process.argv[3];

var stdWidth = 176;
var stdHeight = 30;

fs.readFile(input, 'utf8', function (err, data){

  if (!err){

    var graph = JSON.parse(data);

    //var dimensions = establishDimensions(graph, 0, 0);
    //dimensions.x += stdWidth;
    //dimensions.y += stdHeight;

    //console.log(dimensions);

    var graphVis = 'digraph G {\ngraph [splines=ortho, nodesep=1]\nnode [style="filled"]\n' + traverseNode(graph) + '}';

    fs.writeFile(output, graphVis, 'utf8', function (err){

      if (!err){
        console.log('done');
      }

    })

  } else {
    console.log(err);
  }

});

function establishDimensions (node, x, y){
  var out = {
    x : x,
    y : y
  };

  if (node.meta.x > out.x) out.x = node.meta.x;
  if (node.meta.y > out.y) out.y = node.meta.y;
  if (node.childNodes){
    node.childNodes.forEach(function (childNode){
      out = establishDimensions(childNode, out.x, out.y);
    });
  }
  return out;
}

//var graph = JSON.parse(input);

//var graphVis = 'digraph G {\nnode [style="filled"]\n' + traverseNode(graph) + '}';

//console.log(graphVis);


//process.stdout.write(graphVis);


function traverseNode (node){

  var str = "";

  str += '"' + node.label + '" [shape="box"];\n';

  if (node.childNodes){
    node.childNodes.forEach(function (childNode){

      str += '"' + node.label + '" -> "' + childNode.label + '";\n';
      str += traverseNode (childNode);

    });
  }

  return str;

}