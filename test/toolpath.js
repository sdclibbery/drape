define(function(require) {

var toolpath = require('cnc/toolpath');
var vector = require('vector');
var prim = require('modelling/primitives');
var bottom = require('modelling/bottom');
var search = require('cnc/analysis/search');

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
var lessThan = e => (a => ({ result: (a < e), msg: 'expected '+a.toFixed(5)+' to be less than '+e.toFixed(5) }));
var near = (e, eps) => (a => ({ result: (abs(a-e) < eps), msg: 'expected '+a.toFixed(5)+' to be near to '+e.toFixed(5) }));

function isBottom (s) { return s.pos.z === 0; }

var tests = {};

tests.allPointsOnSurfaceAreCoveredByToolpath = function (surface) {
  surface.size = 1;
  var tp = toolpath(surface);
  for (var i=0; i<1000; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var s = surface(x,y);
    if (!isBottom(s)) {
      var nearest = search.nearestPointsOnToolpath(s.pos, tp);
      var distance = search.distanceToLine(s.pos, nearest[0], nearest[1]);
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

var heightFromToolpath = function (p, toolpath) {
  var nearestToolpathPoints = search.nearestPointsOnToolpath(p, toolpath);
  var nearestPointOnToolpath = search.nearestPointOnLine(p, nearestToolpathPoints[0], nearestToolpathPoints[1]);
  // Take tool profile into account; i.e. scalloping
  return nearestPointOnToolpath.z;
};

function runTest (name, surfaceName, surface) {
  console.log('toolpath '+name+' '+surfaceName);
  tests[name](surface);
}
return function () {
  for (name in tests) {
    runTest(name, 'cube', prim.cube(0.8));
//    runTest(name, 'sphere', prim.sphere(0.4));
  }
};

});
