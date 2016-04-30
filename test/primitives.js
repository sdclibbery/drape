define(function(require) {

var vector = require('vector');
var prim = require('modelling/primitives');
var ellipse = require('modelling/profile/ellipse');
var line = require('modelling/path/line');
var power = require('modelling/scale/power');

var abs = Math.abs;
var sqrt = Math.sqrt;
var sqr = x => x*x;
var sin = Math.sin;

var v2s = function (v) {
  return '(' + v.x.toFixed(3) + ',' + v.y.toFixed(3) + ','+v.z.toFixed(3) + ')';
};

var assert = function (surf, pred, m) {
  if (!pred(surf)) { console.log(m+' at ' + v2s(surf.pos) + ' cut: ' + v2s(surf.cutDir)); }
};

var commonProperties = function (x,y, surf) {
  assert(surf, s => s.pos.x == x, 'pos x');
  assert(surf, s => s.pos.y == y, 'pos y');
  assert(surf, s => s.pos.z == 0 || s.cutDir.cross(s.pos).z < 0, 'cutDir is clockwise');
  assert(surf, s => s.cutDir.isUnit(), 'cutDir is unit');
};

var deltaDistance = 1e-5;
var delta = function (surface, surf, dir) {
  var hdir = new vector(dir.x, dir.y, 0).unit();
  var pos = surf.pos.add(hdir.multiply(deltaDistance));
  return surface(pos.x, pos.y);
}

var nearTo = function (v1, v2, eps) {
  return abs(v2-v1) < eps;
}

var calcNormal = function (s, sc, sp) {
  var c = sc.pos.subtract(s.pos);
  var p = sp.pos.subtract(s.pos);
  return p.cross(c).unit();
};

var calcCurvature = function (sn, s, sp) {
  var x1 = -deltaDistance;
  var y1 = sn.pos.z;
  var y2 = s.pos.z;
  var x3 = deltaDistance;
  var y3 = sp.pos.z;
  return (2*abs(x1*y2 + x3*y1 - x1*y3 - x3*y2)) / sqrt((sqr(x1) + sqr(y2-y1)) * (sqr(x3) + sqr(y2-y3)) * (sqr(x3-x1) + sqr(y3-y1)));
};

var numericalTests = function (surface, surf) {
  var c = surf.cutDir;
  var p = surf.cutDir.cross(surf.norm);
  var sc = delta(surface, surf, c);
  var sp = delta(surface, surf, p);
  assert(surf, s => s.norm.nearTo(calcNormal(s, sc, sp), 1e-4), 'normal is close to calculated normal');
  var scn = delta(surface, surf, c.negative());
  var spn = delta(surface, surf, p.negative());
  assert(surf, s => nearTo(s.cutCurvature, calcCurvature(scn, s, sc), 1e-4), 'cutCurvature is close to calculated cutCurvature '+surf.cutCurvature+' '+calcCurvature(scn, surf, sc));
  assert(surf, s => nearTo(s.perpCurvature, calcCurvature(spn, s, sp), 1e-4), 'perpCurvature is close to calculated perpCurvature '+surf.perpCurvature+' '+calcCurvature(spn, surf, sp));
};

var test = function (surface, customProperties) {
  for (var i=0; i<100; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var surf = surface(x,y);
    commonProperties(x,y, surf);
//    numericalTests(surface, surf);
    if (surf.pos.z > 0) {
      customProperties(surf);
    }
  }
};

var testSuites = {};

testSuites.cube = function () {
  test(prim.cube(2), function (surf) {
    assert(surf, s => abs(s.cutDir.x) === 0 || abs(s.cutDir.y) === 0, 'cutDir always on an axis');
  });
};

testSuites.sphere = function () {
  test(prim.sphere(1), function (surf) {
    assert(surf, s => s.pos.isUnit(), 'radius');
  });
};

testSuites.lineSweptEllipse = function () {
  test(prim.sweep(line(-1,0, 1,0), ellipse(1, 1), power(0)), function (surf) {
  });
};

testSuites.lineSweptEllipseDiagonal = function () {
  test(prim.sweep(line(-1,-1, 1,1), ellipse(0.5, 0.5), power(0)), function (surf) {
  });
};

testSuites.lineSweptEllipseLinearScale = function () {
  test(prim.sweep(line(-1,-1, 1,1), ellipse(0.5, 0.5), power(1)), function (surf) {
  });
};

testSuites.lineSweptEllipsePowerScale = function () {
  test(prim.sweep(line(-1,-1, 1,1), ellipse(0.5, 0.5), power(0.25)), function (surf) {
  });
};

return function () {
  for (name in testSuites) {
    console.log(name);
    testSuites[name]();
  }
};

});
