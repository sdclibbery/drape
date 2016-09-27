define(function(require) {

var vector = require('vector');

return function (surface, tool) {
  var tp = [];

  grid(new vector(0,0), surface.size, tool.radius)
    .map(v => surface(v.x, v.y)).filter(s => !s.isBottom)
    .reduce(makeSegments, [[]])
    .filter(a => a.length).reduce(joinSegments, [])
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
};

function makeSegments (segments, s, i) {
  if (i%10 == 0) { segments.push([]); }
  //! Look at only combining if in correct direction?
  segments[segments.length-1].push(s);
  return segments;
};

function joinSegments (nodes, s) {
  return nodes.concat(
    {pos:s[0].pos.setZ(80)},
    s,
    {pos:s[s.length-1].pos.setZ(80)}
  );
};

});
