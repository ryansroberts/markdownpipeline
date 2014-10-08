var PathView = require('./visualiser/path-view.js');

$.get('result.json', function (data){

  var $context = $('#map-render');

  var pathView = new PathView(data, $context, false, 1);
  pathView.render();

});