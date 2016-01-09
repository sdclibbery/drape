define(function(require) {

return function () {
  var resX = 50;
  var resY = 50;
  var vtxResX = resX+1;
  var vtxResY = resY+1;
  var size = 200;

  var numVtxs = vtxResX*vtxResY;
  var vtxPosns = new Float32Array(numVtxs*3);
  for (var y = 0; y < vtxResY; y++) {
    for (var x = 0; x < vtxResX; x++) {
      var v = (x + y*vtxResX) * 3;
      vtxPosns[v+0] = (x - vtxResX/2)*size/vtxResX;
      vtxPosns[v+1] = -10 + 3*Math.sin(x/vtxResX*30) + 3*Math.sin(y/vtxResY*30);
      vtxPosns[v+2] = -y*size/vtxResY;
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
      indexes[i+4] = v+1;
      indexes[i+5] = v+vtxResX+1;
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
