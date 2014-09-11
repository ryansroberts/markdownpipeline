var fs = require('fs');

var input = process.argv[2];
var output = process.argv[3];

console.log(input + ' -> ' + output);

fs.readFile(input, 'utf8', function (err, data){

  if (!err){

    var graph = JSON.parse(data);

    var graphVis = 'digraph G {\nnode [style="filled"]\n' + traverseNode(graph) + '}';

    fs.writeFile(output, graphVis, 'utf8', function (err){

      if (!err){
        console.log('done');
      }

    })

  }

})

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