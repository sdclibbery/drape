define(function(require) {

var vector = require('vector');

return function (surface) {
  var resX = 50;
  var resY = 50;
  var size = 0.5;

  var nodes = [];
  for (var y = 0; y < resY; y++) {
    for (var xl = 0; xl < resX; xl++) {
      if (y%2) { x = resX - 1 - xl; } else { x = xl; }
      var posx = (x - resX/2)*size/resX;
      var posy = (y - resY/2)*size/resY;
      nodes.push({ pos: surface(posx, posy).pos, });
    }
  }

  return nodes;
};

});
