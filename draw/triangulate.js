define(function(require) {

var vector = require('vector');

var sqrt = Math.sqrt;
var sqr = x => x*x;
var sin = Math.sin;

var deltaDistance = 1e-5;
var delta = function (surface, surf, dir) {
  var hdir = new vector(dir.x, dir.y, 0).unit();
  var pos = surf.pos.add(hdir.multiply(deltaDistance));
  return surface(pos.x, pos.y);
}

var calcNormal = function (s, sc, sp) {
  var c = sc.pos.subtract(s.pos);
  var p = sp.pos.subtract(s.pos);
  return p.cross(c).unit();
};

/*var calcCurvature = function (sn, s, sp) {
  var x1 = -deltaDistance;
  var y1 = sn.pos.z;
  var y2 = s.pos.z;
  var x3 = deltaDistance;
  var y3 = sp.pos.z;
  return (2*abs(x1*y2 + x3*y1 - x1*y3 - x3*y2)) / sqrt((sqr(x1) + sqr(y2-y1)) * (sqr(x3) + sqr(y2-y3)) * (sqr(x3-x1) + sqr(y3-y1)));
};*/

var gcodeToGl = function (arr, i, v) {
  arr[i+0] = v.x;
  arr[i+1] = v.z;
  arr[i+2] = v.y;
};

return function (surface) {
  var resX = 60;
  var resY = 60;
  var size = surface.size;
  var vtxResX = resX+1;
  var vtxResY = resY+1;

  var numVtxs = vtxResX*vtxResY;
  var vtxNorms = new Float32Array(numVtxs*3);
  var vtxPosns = new Float32Array(numVtxs*3);
  for (var y = 0; y < vtxResY; y++) {
    for (var x = 0; x < vtxResX; x++) {
      var v = (x + y*vtxResX) * 3;
      var xpos = (x - vtxResX/2)*size/vtxResX;
      var ypos = (y - vtxResY/2)*size/vtxResY;
      var s = surface(xpos, ypos);
      gcodeToGl(vtxPosns, v, s.pos.add(new vector(0,0,-0.003)));
      var c = s.cutDir;
      var p = new vector(c.y, -c.x, 0).unit();
      var sc = delta(surface, s, c);
      var sp = delta(surface, s, p);
      gcodeToGl(vtxNorms, v, calcNormal(s, sc, sp));
    }
  }

  var numIndices = resX*resY*6;
  var indexes = new Uint16Array(numIndices);
  for (var y = 0; y < resY; y++) {
    for (var x = 0; x < resX; x++) {
      var i = (x + y*resX) * 6;
      var v = x + y*vtxResX;
      indexes[i+0] = v;
      indexes[i+1] = v+vtxResX;
      indexes[i+2] = v+1;
      indexes[i+3] = v+vtxResX;
      indexes[i+4] = v+vtxResX+1;
      indexes[i+5] = v+1;
    }
  }

  return {
    numVtxs: numVtxs,
    posns: vtxPosns,
    norms: vtxNorms,
    numIndices: numIndices,
    indexes: indexes
  };
};

});
