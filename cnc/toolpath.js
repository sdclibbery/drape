define(function(require) {

var vector = require('vector');

return function (surface, tool) {
  var tp = [];

  grid(new vector(0,0), surface.size, tool.radius)
    .map(v => surface(v.x, v.y))
    .filter(s => !s.isBottom)
    .map(s => tp.push({ pos: s.pos, }));

  return tp;
};

function grid (ctr, size, step) {
  const hsize = size/2;
  var result = [];
  for (var x = ctr.x-hsize; x <= ctr.x+hsize; x+=step) {
    for (var y = ctr.y-hsize; y <= ctr.y+hsize; y+=step) {
      result.push(new vector(x, y));
    }
  }
  return result;
}

});
