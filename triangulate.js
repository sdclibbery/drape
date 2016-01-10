define(function(require) {

var Vector = require('vector');

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
      vtxPosns[v+0] = s.pos.x;
      vtxPosns[v+1] = s.pos.z;
      vtxPosns[v+2] = s.pos.y;
      vtxNorms[v+0] = s.norm.x;
      vtxNorms[v+1] = s.norm.z;
      vtxNorms[v+2] = s.norm.y;
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
