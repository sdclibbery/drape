define(function(require) {

var toolpath = require('cnc/toolpath');
var ballend = require('cnc/tool/ballend');
var vector = require('vector');
var bezier = require('modelling/path/bezier');
var ellipse = require('modelling/profile/ellipse');
var prim = require('modelling/primitives');
var power = require('modelling/scale/power');
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
var atLeast = e => (a => ({ result: (a >= e), msg: 'expected '+a.toFixed(5)+' to be at least '+e.toFixed(5) }));

var tests = {};

tests.allPointsOnSurfaceAreCoveredByToolpath2D = function (surface) {
  surface.size = 100;
  const toolRadius = 5;
  var tp = toolpath(surface, ballend(toolRadius));
  expect(tp.length).toBe(atLeast(2));
  for (var i=0; i<1000; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var s = surface(x,y);
    var nearest = search.toolpath.nearestPoints2D(s.pos, tp);
    var distance = search.line.distance2D(s.pos, nearest[0], nearest[1]);
    var msg = s.pos + " near: " + nearest+' r: '+s.pos.length().toFixed(4);
    expect(distance, msg).toBe(lessThan(toolRadius));
  }
};

function runTest (name, surfaceName, surface) {
  console.log('toolpath '+name+' '+surfaceName);
  tests[name](surface);
}
return function () {
  for (name in tests) {
    runTest(name, 'cube', prim.cube(80));
    runTest(name, 'sphere', prim.sphere(40));
    runTest(name, 'bezier sweep', prim.sweep(bezier(20,40, -65,70, 65,-70, -20,-40), ellipse(5, 12), power(0.25)));
  }
};

});
