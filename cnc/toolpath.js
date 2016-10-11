define(function(require) {

var vector = require('vector');

return function (surface, tool) {
  var tp = [];

  var nodes = grid(new vector(0,0), surface.size, tool.radius)
    .map(v => surface(v.x, v.y)).filter(s => !s.isBottom);

  makeSegments(nodes)
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

function makeSegments (nodes) {
  var segments = [];
  var len = nodes.length;
  while (nodes.length) {
    segments.push(traceSegment(nodes));
  }
  return segments;
};

function traceSegment (nodes) {
  var segment = [];
  var node = takeNode(nodes, 0);
  do {
    segment.push(node);
    node = nextNode(nodes, segment[segment.length-1]);
  } while (node);
  return segment;
};

function nextNode (nodes, current) {
  var bestIdx, best = -0.5;
  nodes.map(function (node, idx) {
    var delta = current.pos.as2D().subtract(node.pos.as2D());
    var projection = Math.abs(delta.unit().dot(current.cutDir)); // !! Needs to be able to go both directions...
    if (delta.length() < 5 && projection > best) {
      best = projection;
      bestIdx = idx;
    }
  });
  if (!bestIdx) { return; }
  return takeNode(nodes, bestIdx);
};

function takeNode (nodes, idx) {
  return nodes.splice(idx, 1)[0];
};

function joinSegments (nodes, s) {
  return nodes.concat(
    {pos:s[0].pos.setZ(80)},
    s,
    {pos:s[s.length-1].pos.setZ(80)}
  );
};

});
