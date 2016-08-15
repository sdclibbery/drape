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
var near = (e, eps) => (a => ({ result: (abs(a-e) < eps), msg: 'expected '+a.toString(5)+' to be near to '+e.toString(5) }));
var vectorNearTo = e => (a => ({ result: a.nearTo(e), msg: 'expected '+a.toString(5)+' to be near to '+e.toString(5) }));

var tests = {};

tests.distanceToLine = function () {
  var v = (x,y) => new vector(x,y);
  expect(distanceToLine(v(1,1), v(2,1), v(5,1)), 't1').toBe(equalTo(1));
  expect(distanceToLine(v(2,1), v(2,1), v(5,1)), 't2').toBe(equalTo(0));
  expect(distanceToLine(v(3,1), v(2,1), v(5,1)), 't3').toBe(equalTo(0));
  expect(distanceToLine(v(3,0), v(2,1), v(5,1)), 't4').toBe(equalTo(1));
  expect(distanceToLine(v(5,1), v(2,1), v(5,1)), 't5').toBe(equalTo(0));
  expect(distanceToLine(v(6,1), v(2,1), v(5,1)), 't6').toBe(equalTo(1));

  expect(distanceToLine(v(-0.401,-0.312), v(-0.417,-0.317), v(-0.400,-0.317)), 't7').toBe(lessThan(0.017));
};

tests.nearestPointOnLine = function () {
  var v = (x,y) => new vector(x,y);
  expect(nearestPointOnLine(v(1,1), v(2,1), v(5,1)), 't1').toBe(vectorNearTo(v(2,1)));
  expect(nearestPointOnLine(v(2,1), v(2,1), v(5,1)), 't1').toBe(vectorNearTo(v(2,1)));
  expect(nearestPointOnLine(v(3,1), v(2,1), v(5,1)), 't1').toBe(vectorNearTo(v(3,1)));
  expect(nearestPointOnLine(v(3,0), v(2,1), v(5,1)), 't1').toBe(vectorNearTo(v(3,1)));
  expect(nearestPointOnLine(v(5,1), v(2,1), v(5,1)), 't1').toBe(vectorNearTo(v(5,1)));
  expect(nearestPointOnLine(v(6,1), v(2,1), v(5,1)), 't1').toBe(vectorNearTo(v(5,1)));
};

tests.allPointsOnSurfaceAreCoveredByToolpath = function () {
  var surface = prim.cube(0.8);
  surface.size = 1;
  var tp = toolpath(surface);
  for (var i=0; i<1000; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var s = surface(x,y);
    var nearest = nearestPointsOnToolpath(s.pos, tp);
    var distance = distanceToLine(s.pos, nearest[0], nearest[1]);
    var msg = s.pos + " near: " + nearest;
    expect(distance, msg).toBe(lessThan(tp.toolRadius));
  }
}

tests.allPointsOnSurfaceAreCutToCorrectHeight = function () {
  var surface = prim.cube(0.8);
  surface.size = 1;
  var tp = toolpath(surface);
  for (var i=0; i<1000; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var s = surface(x,y);
    var height = heightFromToolpath(s.pos, tp);
    expect(height, s.pos).toBe(near(s.pos.z, 1e-4));
  }
}

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
  var along = dir.multiply(param);
  return a.add(along.multiply(param));
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
      bestPoints = [a, b];
    }
  });
  return bestPoints;
};

return function () {
  for (name in tests) {
    console.log('toolpath '+name);
    tests[name]();
  }
};

});
