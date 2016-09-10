define(function(require) {

var vector = require('vector');
var prim = require('modelling/primitives');
var ellipse = require('modelling/profile/ellipse');
var line = require('modelling/path/line');
var bezier = require('modelling/path/bezier');
var power = require('modelling/scale/power');

var abs = Math.abs;

var v2s = function (v) {
  return '(' + v.x.toFixed(3) + ',' + v.y.toFixed(3) + ','+v.z.toFixed(3) + ')';
};

var assert = function (surf, pred, m) {
  if (!pred(surf)) { console.log(m+' at ' + v2s(surf.pos) + ' cut: ' + v2s(surf.cutDir)); }
};

var nextPointAlongCutDir = function (s, surface) {
    var nextPoint = s.pos.add(s.cutDir.multiply(0.001));
    return surface(nextPoint.x, nextPoint.y);
}

var commonProperties = function (x,y, surf, surface) {
  assert(surf, s => s.pos.x == x, 'pos x');
  assert(surf, s => s.pos.y == y, 'pos y');
  assert(surf, s => s.pos.z >= 0, 'height min');
  assert(surf, s => s.pos.z <= 1, 'height max');
  assert(surf, s => s.pos.z == 0 || s.cutDir.cross(s.pos).z <= 0, 'cutDir is clockwise');
  assert(surf, s => s.cutDir.isUnit(), 'cutDir is unit');
  assert(surf, s => s.pos.z == 0 || nextPointAlongCutDir(s, surface).pos.z > 0, 'cutDir points back onto the primitive');
};

var test = function (surface, customProperties) {
  for (var i=0; i<100; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var surf = surface(x,y);
    commonProperties(x,y, surf, surface);
//    numericalTests(surface, surf);
    if (surf.pos.z > 0) {
      customProperties(surf);
    }
  }
};

var testSuites = {};

testSuites.cube = function () {
  test(prim.cube(1), function (surf) {
    assert(surf, s => abs(s.cutDir.x) === 0 || abs(s.cutDir.y) === 0, 'cutDir always on an axis');
  });
};

testSuites.sphere = function () {
  test(prim.sphere(1), function (surf) {
    assert(surf, s => s.pos.isUnit(), 'radius');
  });
};

testSuites.lineSweptEllipse = function () {
  test(prim.sweep(line(-1,0, 1,0), ellipse(1, 1), power(0)), function (surf) {});
};

testSuites.lineSweptEllipseDiagonal = function () {
  test(prim.sweep(line(-1,-1, 1,1), ellipse(0.5, 0.5), power(0)), function (surf) {});
};

testSuites.lineSweptEllipseLinearScale = function () {
  test(prim.sweep(line(-1,-1, 1,1), ellipse(0.5, 0.5), power(1)), function (surf) {});
};

testSuites.lineSweptEllipsePowerScale = function () {
  test(prim.sweep(line(-1,-1, 1,1), ellipse(0.5, 0.5), power(0.25)), function (surf) {});
};

testSuites.bezierSweptEllipse = function () {
  test(prim.sweep(bezier(-1,0, 0,0, 0,0, 1,0), ellipse(1, 1), power(0)), function (surf) {});
};

testSuites.bezierSweptEllipsePowerScale = function () {
  test(prim.sweep(bezier(-1,0, 0,0, 0,0, 1,0), ellipse(1, 1), power(0.25)), function (surf) {});
};

return function () {
  for (name in testSuites) {
    console.log('primitive '+name);
    testSuites[name]();
  }
};

});
