define(function(require) {

var prim = require('modelling/primitives');
var vector = require('vector');

var assert = function (surf, pred, m) {
  if (!pred(surf)) { console.log(m+' at '+surf.pos.x.toFixed(3)+', '+surf.pos.y.toFixed(3)+', '+surf.pos.z.toFixed(3)); }
};

var propertyTests = function (surf) {
  assert(surf, function(surf) { return surf.norm.perpTo(surf.tangent); } , 'norm _|_ tangent');
};

return function () {
  console.log('cube(1)');
  var cube = prim.cube(1);
  for (var i=0; i<100; i++) {
    var x = 1.1*(Math.random()-0.5);
    var y = 1.1*(Math.random()-0.5);
    propertyTests(cube(x,y));
  }
};

});