define(function(require) {

var prim = require('modelling/primitives');
var vector = require('vector');

var assert = function (surf, pred, m) {
  if (!pred(surf)) { console.log(m+' at '+surf.pos.x.toFixed(3)+', '+surf.pos.y.toFixed(3)+', '+surf.pos.z.toFixed(3)); }
};

var commonProperies = function (surf) {
  assert(surf, s => s.norm.perpTo(s.tangent), 'norm _|_ tangent');
};

var testCube = function () {
  console.log('cube(1)');
  var cube = prim.cube(1);
  for (var i=0; i<100; i++) {
    var x = 1.1*(Math.random()-0.5);
    var y = 1.1*(Math.random()-0.5);
    var surf = cube(x,y)
    commonProperies(surf);
    assert(surf, s => s.norm.z === 1, 'normal always points up');
    // tangent is always clockwise and on an axis
    assert(surf, s => s.tangentCurvature === 0, 'curvature is zero');
    assert(surf, s => s.cotangentCurvature === 0, 'perp curvature is zero');
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