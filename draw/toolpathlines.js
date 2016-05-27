define(function(require) {

var vector = require('vector');

var gcodeToGl = function (arr, i, v) {
  arr[i+0] = v.x;
  arr[i+1] = v.z;
  arr[i+2] = v.y;
};

return function (toolpath) {
  var numVtxs = toolpath.length;
  var numIndices = (toolpath.length-1)*2;
  var indexes = new Uint16Array(numIndices);
  var vtxPosns = new Float32Array(numVtxs*3);
  toolpath.map(function (node, idx, t) {
    gcodeToGl(vtxPosns, idx * 3, node.pos);
    if (idx > 0) {
      var i = idx * 2;
      var v = idx;
      indexes[i-2] = v-1;
      indexes[i-1] = v;
    }
  });

  return {
    numVtxs: numVtxs,
    posns: vtxPosns,
    numIndices: numIndices,
    indexes: indexes
  };
};

});
