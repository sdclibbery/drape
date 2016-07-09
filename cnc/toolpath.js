define(function(require) {

var vector = require('vector');

return function (surface) {
  var tp = [];
  var res = 60;
  tp.toolRadius = surface.size / res;
  var size = surface.size;

  for (var y = 0; y < res; y++) {
    for (var xl = 0; xl < res; xl++) {
      if (y%2) { x = res - 1 - xl; } else { x = xl; }
      var posx = (x - res/2)*size/res;
      var posy = (y - res/2)*size/res;
      tp.push({ pos: surface(posx, posy).pos, });
    }
  }
  return tp;
};

});
