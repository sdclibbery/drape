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
  var size = 0.5;

  var numVtxs = resX*resY*2;
  var vtxPosns = new Float32Array(numVtxs*3);
  for (var y = 0; y < resY; y++) {
    for (var x = 0; x < resX; x++) {
      var v = (x + y*resX) * 6;
      var posx = (x - resX/2)*size/resX;
      var posy = (y - resY/2)*size/resY;
      var s = surface(posx, posy);
      s.pos.z += 0.003;
      gcodeToGl(vtxPosns, v, s.pos);
      gcodeToGl(vtxPosns, v+3, s.pos.add(s.cutDir.multiply(size*0.8/resX)));
    }
  }

  var numIndices = resX*resY*2;
  var indexes = new Uint16Array(numIndices);
  for (var y = 0; y < resY; y++) {
    for (var x = 0; x < resX; x++) {
      var i = (x + y*resX) * 2;
      var v = i;
      indexes[i+0] = v;
      indexes[i+1] = v+1;
    }
  }

  return {
    numVtxs: numVtxs,
    posns: vtxPosns,
    numIndices: numIndices,
    indexes: indexes
  };
};

});
