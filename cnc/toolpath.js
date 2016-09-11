define(function(require) {

var vector = require('vector');

return function (surface, tool) {
  var tp = [];
  var max = gridSampledMaximum(surface, new vector(0,0), surface.size, 10);
  max = gridSampledMaximum(surface, max.as2D(), surface.size/10, 10);

tp.push({ pos: surface(max.x, max.y).pos, });
tp.push({ pos: surface(max.x, max.y).pos.add(surface(max.x, max.y).cutDir), });

  return tp;
};

function gridSampledMaximum (surface, ctr, size, res) {
  var maximum = new vector(0,0,0);
  for (var y = 0; y <= res; y++) {
    for (var x = 0; x <= res; x++) {
      var posx = ctr.x + (x - res/2)*size/res;
      var posy = ctr.y + (y - res/2)*size/res;
      const pos = surface(posx, posy).pos;
      if (pos.z > maximum.z) {
        maximum = pos;
      }
    }
  }
  return maximum;
}

});
