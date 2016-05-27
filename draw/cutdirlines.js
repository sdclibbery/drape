define(function(require) {

var vector = require('vector');

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

  var numVtxs = resX*resY*4;
  var vtxPosns = new Float32Array(numVtxs*3);
  for (var y = 0; y < resY; y++) {
    for (var x = 0; x < resX; x++) {
      var v = (x + y*resX) * 12;
      var posx = (x - resX/2)*size/resX;
      var posy = (y - resY/2)*size/resY;
      var s = surface(posx, posy);
      s.pos.z += 0.003;
      var len = size*0.8/resX;
      var headLen = len*0.3;
      var headHW = len*0.2;
      var perp = new vector(-s.cutDir.y, s.cutDir.x, 0);
      gcodeToGl(vtxPosns, v, s.pos.add(s.cutDir.multiply(-len*0.5)));
      gcodeToGl(vtxPosns, v+3, s.pos.add(s.cutDir.multiply(len*0.5)));
      gcodeToGl(vtxPosns, v+6, s.pos.add(s.cutDir.multiply(headLen)).add(perp.multiply(headHW)));
      gcodeToGl(vtxPosns, v+9, s.pos.add(s.cutDir.multiply(headLen)).add(perp.multiply(-headHW)));
    }
  }

  var numIndices = resX*resY*6;
  var indexes = new Uint16Array(numIndices);
  for (var y = 0; y < resY; y++) {
    for (var x = 0; x < resX; x++) {
      var i = (x + y*resX) * 6;
      var v = (x + y*resX) * 4;
      indexes[i+0] = v;
      indexes[i+1] = v+1;
      indexes[i+2] = v+1;
      indexes[i+3] = v+2;
      indexes[i+4] = v+1;
      indexes[i+5] = v+3;
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
