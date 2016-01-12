define(function(require) {

var prim = require('modelling/primitives');
var vector = require('vector');

var assert = function (surf, pred, m) {
  if (!pred(surf)) { console.log(m+' at '+surf.pos.x.toFixed(3)+', '+surf.pos.y.toFixed(3)+', '+surf.pos.z.toFixed(3)); }
};

var testCube = function () {
  console.log('cube(1)');
  var cube = prim.cube(1);
  for (var i=0; i<100; i++) {
    var x = 1.1*(Math.random()-0.5);
    var y = 1.1*(Math.random()-0.5);
    // z zero outside cube
    // z one inside cube
    // normal always points up
    assert(cube(x,y), s => s.norm.perpTo(s.tangent), 'norm _|_ tangent');
    // tangent...
    // curvature always zero
  }
};

// Sphere
 // norm _|_ tangent
 // norm is direction to point
 // tangent is always pointing around the sphere (z cpt is zero)
 // pos distance from ctr pt is always radius
 // curvature..?

return function () {
  testCube();
};

});