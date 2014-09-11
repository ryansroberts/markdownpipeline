var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var marked = require('marked');
var Gatherer = require('gm-gather');

var output = process.argv[2];

/*
var example = fs.readFileSync('./src/pandoc/CG15/pathways/Managing Type 2 Diabetes/managing-type-2-diabetes.md', 'utf8');

var ex = marked(example);
var doc = jsdom.env(ex, ['http://code.jquery.com/jquery.js'], function (err, window){

  var code = JSON.parse(window.$('code').text());

  window.$('a[rel="/pathways/link-down"]');

  console.log(window.$('code').text())

});
*/

function loadNode (filepath, file, node, callback){

  fs.readFile(path.join(filepath, file), 'utf8', function (err, data){

    var html = '<div>' + marked(data) + '</div>';

    if (!err){

      jsdom.env(html, ['http://code.jquery.com/jquery.js'], function (err, window){

        var $ = window.$;

        if (!err){

          // extract data...
          node.meta = JSON.parse($('code').text());
          // remove the pre/code block...
          $('pre').remove();

          if($('a[rel="/pathways/link-down"]').length){

            node.childNodes = [];

            var gather = new Gatherer();

            $('a[rel="/pathways/link-down"]').each(function (index, link){
                
              var childNode = {};
              node.childNodes.push(childNode);
              $(link).remove();

              gather.task(function (done, error){

                loadNode( filepath, $(link).attr('href') + '.md', childNode, function (err){

                  if (!err){
                    done();
                  } else {
                    error(err);
                  }

                });

              });

            });

            gather.run(function (err){

              if (!err){

                node.label = $('h1').text();
                node.html = encodeURIComponent($('div').html());
                callback( false, node);

              }

            });


          } else {

            // copy across the html... 
            node.label = $('h1').text();
            node.html = encodeURIComponent($('div').html());
            // and pass along our new node... 
            callback( false, node );

          }

        } else { callback( err ); }

      });

    } else { callback( err ); }

  });

}

loadNode ('./src/pandoc/CG15/pathways/Managing Type 2 Diabetes', 'managing-type-2-diabetes.md', {}, function (err, node){

    fs.writeFile(output, JSON.stringify(node), 'utf8', function (err){

      if (!err){
        console.log('Okay');
      }

    });

});