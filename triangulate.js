define(function(require) {

var Vector = require('vector');

var gcodeToGl = function (arr, i, v) {
  arr[i+0] = v.x;
  arr[i+1] = v.z;
  arr[i+2] = v.y;
};

return function (surface) {
  var resX = 50;
  var resY = 50;
  var vtxResX = resX+1;
  var vtxResY = resY+1;
  var size = 50;

  var numVtxs = vtxResX*vtxResY;
  var vtxNorms = new Float32Array(numVtxs*3);
  var vtxPosns = new Float32Array(numVtxs*3);  
  for (var y = 0; y < vtxResY; y++) {
    for (var x = 0; x < vtxResX; x++) {
      var v = (x + y*vtxResX) * 3;
      var xpos = (x - vtxResX/2)*size/vtxResX;
      var zpos = (y - vtxResY/2)*size/vtxResY;
      var s = surface(xpos, zpos);
      gcodeToGl(vtxPosns, v, s.pos);
      gcodeToGl(vtxNorms, v, s.norm);
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
