define(function(require) {

var toolpath = require('cnc/toolpath');
var vector = require('vector');
var prim = require('modelling/primitives');

var distanceToLine = function (p, a, b) {
  var line = b.subtract(a);
  var dir = line.unit();
  var pa = p.subtract(a);
  var param = pa.dot(dir);
  if (param <= 0) { return pa.length(); }
  if (param >= line.length()) { return p.subtract(b).length(); }
  var along = dir.multiply(param);
  var perp = pa.subtract(along);
  return perp.length();
};

var distanceTo = function (p, toolpath) {
  var best = Infinity;
  toolpath.map(function (node, idx) {
    if (idx === 0) { return; }
    var a = toolpath[idx-1].pos;
    var b = node.pos;
    best = Math.min(best, distanceToLine(p, a, b));
  });
  return best;
};

var expect = function (actual, id) {
  return { toBe: function (matcher) {
    var r = matcher(actual);
    if (!r.result) {
      console.log("!", id, " failed!");
      console.log("  ", r.msg);
    }
  } };
};
var equalTo = e => (a => ({ result: (a === e), msg: 'expected '+a+' to be '+e }));
var lessThan = e => (a => ({ result: (a < e), msg: 'expected '+a+' to be less than '+e }));

var tests = {};

tests.allPointsOnSurfaceAreCoveredByToolpath = function () {
  var surface = prim.cube(0.5);
  surface.size = 0.6;
  var tp = toolpath(surface);
  for (var i=0; i<100; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var distance = distanceTo(new vector(x, y), tp);
    expect(distance, x+','+y).toBe(lessThan(tp.toolRadius));
  }
}

tests.distanceToLine = function () {
  var v = (x,y) => new vector(x,y);
  expect(distanceToLine(v(1,1), v(2,1), v(5,1)), 't1').toBe(equalTo(1));
  expect(distanceToLine(v(2,1), v(2,1), v(5,1)), 't2').toBe(equalTo(0));
  expect(distanceToLine(v(3,1), v(2,1), v(5,1)), 't3').toBe(equalTo(0));
  expect(distanceToLine(v(3,0), v(2,1), v(5,1)), 't4').toBe(equalTo(1));
  expect(distanceToLine(v(5,1), v(2,1), v(5,1)), 't5').toBe(equalTo(0));
  expect(distanceToLine(v(6,1), v(2,1), v(5,1)), 't6').toBe(equalTo(1));
};

return function () {
  for (name in tests) {
    console.log('toolpath '+name);
    tests[name]();
  }
};

});
