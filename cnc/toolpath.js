define(function(require) {

var vector = require('vector');

return function (surface, tool) {
  var tp = [];
  const size = surface.size;
  const res = Math.floor(size / tool.radius);

  for (var y = 0; y <= res; y++) {
    for (var xl = 0; xl <= res; xl++) {
      if (y%2) { x = res - xl; } else { x = xl; }
      var posx = (x - res/2)*size/res;
      var posy = (y - res/2)*size/res;
      tp.push({ pos: surface(posx, posy).pos, });
    }
  }
  return tp;
};

});
