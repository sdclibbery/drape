define(function(require) {

var toolpath = require('cnc/toolpath');
var vector = require('vector');
var prim = require('modelling/primitives');
var bottom = require('modelling/bottom');

var abs = Math.abs;

var expect = function (actual, id) {
  return { toBe: function (matcher) {
    var r = matcher(actual);
    if (!r.result) {
      console.log("!", id, " failed!");
      console.log("  ", r.msg);
    }
  } };
};
var equalTo = e => (a => ({ result: (a === e), msg: 'expected '+a.toFixed(5)+' to be '+e.toFixed(5) }));
var lessThan = e => (a => ({ result: (a < e), msg: 'expected '+a.toFixed(5)+' to be less than '+e.toFixed(5) }));
var near = (e, eps) => (a => ({ result: (abs(a-e) < eps), msg: 'expected '+a.toFixed(5)+' to be near to '+e.toFixed(5) }));
var sameAs = e => (a => ({ result: JSON.stringify(a)==JSON.stringify(e), msg: 'expected '+JSON.stringify(a)+' to be same as '+JSON.stringify(e) }));

function isBottom (s) { return s.pos.z === 0; }

var tests = {};

tests.distanceToLine = function () {
  var v = (x,y) => new vector(x,y);
  expect(distanceToLine(v(1,1), v(2,1), v(5,1)), 't1').toBe(equalTo(1));
  expect(distanceToLine(v(2,1), v(2,1), v(5,1)), 't2').toBe(equalTo(0));
  expect(distanceToLine(v(3,1), v(2,1), v(5,1)), 't3').toBe(equalTo(0));
  expect(distanceToLine(v(3,0), v(2,1), v(5,1)), 't4').toBe(equalTo(1));
  expect(distanceToLine(v(3,0), v(5,1), v(2,1)), 't4.5').toBe(equalTo(1));
  expect(distanceToLine(v(5,1), v(2,1), v(5,1)), 't5').toBe(equalTo(0));
  expect(distanceToLine(v(6,1), v(2,1), v(5,1)), 't6').toBe(equalTo(1));

  expect(distanceToLine(v(-0.401,-0.312), v(-0.417,-0.317), v(-0.400,-0.317)), 't7').toBe(lessThan(0.017));
  expect(distanceToLine(v(-0.35048,0.19514,0.80000), v(-0.36000,0.20000,0.80000), v(-0.35000,0.20000,0.80000)), 't8').toBe(lessThan(0.01));
  expect(distanceToLine(v(-0.35048,0.19514,0.80000), v(-0.35000,0.20000,0.80000), v(-0.36000,0.20000,0.80000)), 't9').toBe(lessThan(0.01));
};

tests.nearestPointOnLine = function () {
  var v = (x,y) => new vector(x,y);
  expect(nearestPointOnLine(v(1,1), v(2,1), v(5,1)), 't1').toBe(sameAs(v(2,1)));
  expect(nearestPointOnLine(v(2,1), v(2,1), v(5,1)), 't2').toBe(sameAs(v(2,1)));
  expect(nearestPointOnLine(v(3,1), v(2,1), v(5,1)), 't3').toBe(sameAs(v(3,1)));
  expect(nearestPointOnLine(v(3,0), v(2,1), v(5,1)), 't4').toBe(sameAs(v(3,1)));
  expect(nearestPointOnLine(v(3,0), v(5,1), v(2,1)), 't4.5').toBe(sameAs(v(3,1)));
  expect(nearestPointOnLine(v(5,1), v(2,1), v(5,1)), 't5').toBe(sameAs(v(5,1)));
  expect(nearestPointOnLine(v(6,1), v(2,1), v(5,1)), 't6').toBe(sameAs(v(5,1)));
};

tests.nearestPointsOnToolpath = function () {
  var v = (x,y) => ({pos: new vector(x,y)});
  var a=v(1,1), b=v(1,3), c=v(2,3), d=v(2,1);
  var tp = [ a, b, c, d, a ];
  expect(nearestPointsOnToolpath(v(1,2).pos, tp), 't1').toBe(sameAs([a.pos,b.pos]));
};

tests.allPointsOnSurfaceAreCoveredByToolpath = function (surface) {
  surface.size = 1;
  var tp = toolpath(surface);
  for (var i=0; i<1000; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var s = surface(x,y);
    if (!isBottom(s)) {
      var nearest = nearestPointsOnToolpath(s.pos, tp);
      var distance = distanceToLine(s.pos, nearest[0], nearest[1]);
      var msg = s.pos + " near: " + nearest+' r: '+s.pos.length().toFixed(4);
      expect(distance, msg).toBe(lessThan(tp.toolRadius));
    }
  }
};

tests.allPointsOnSurfaceAreCutToCorrectHeight = function (surface) {
  var tolerance = 1e-3;
  surface.size = 1;
  var tp = toolpath(surface);
  for (var i=0; i<1000; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var s = surface(x,y);
    if (!isBottom(s)) {
      var height = heightFromToolpath(s.pos, tp);
      var msg = s.pos.toString()+' r: '+s.pos.length().toFixed(4);
      expect(height, msg).toBe(near(s.pos.z, tolerance));
    }
  }
};

var distanceToLine = function (p, a, b) {
  var nearest = nearestPointOnLine(p, a, b);
  return nearest.subtract(p).length();
};

var heightFromToolpath = function (p, toolpath) {
  var nearestToolpathPoints = nearestPointsOnToolpath(p, toolpath);
  var nearestPointOnToolpath = nearestPointOnLine(p, nearestToolpathPoints[0], nearestToolpathPoints[1]);
  // Take tool profile into account; i.e. scalloping
  return nearestPointOnToolpath.z;
};

var nearestPointOnLine = function (p, a, b) {
  var line = b.subtract(a);
  var dir = line.unit();
  var pa = p.subtract(a);
  var param = pa.dot(dir);
  if (param <= 0) { return a; }
  if (param >= line.length()) { return b; }
  return a.add(dir.multiply(param));
};

var nearestPointsOnToolpath = function (p, toolpath) {
  var bestDistance = Infinity;
  var bestPoints = [];
  toolpath.map(function (_, idx) {
    if (idx === 0) { return; }
    var a = toolpath[idx].pos;
    var b = toolpath[idx-1].pos;
    var distance = distanceToLine(p, a, b);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPoints = [b, a];
    }
  });
  return bestPoints;
};

function runTest (name, surfaceName, surface) {
  console.log('toolpath '+name+' '+surfaceName);
  tests[name](surface);
}
return function () {
  for (name in tests) {
    runTest(name, 'cube', prim.cube(0.8));
    runTest(name, 'sphere', prim.sphere(0.4));
  }
};

});
