define(function(require) {

var search = require('cnc/analysis/search');
var vector = require('vector');

var expect = function (actual, id) {
  return { toBe: function (matcher) {
    var r = matcher(actual);
    if (!r.result) {
      console.log("!", id, " failed!");
      console.log("  ", r.msg);
    }
  } };
};
var sameAs = e => (a => ({ result: JSON.stringify(a)==JSON.stringify(e), msg: 'expected '+JSON.stringify(a)+' to be same as '+JSON.stringify(e) }));
var equalTo = e => (a => ({ result: (a === e), msg: 'expected '+a.toFixed(5)+' to be '+e.toFixed(5) }));
var lessThan = e => (a => ({ result: (a < e), msg: 'expected '+a.toFixed(5)+' to be less than '+e.toFixed(5) }));

var tests = {};

tests.distanceToLine = function () {
  var v = (x,y) => new vector(x,y);
  expect(search.line.distance(v(1,1), v(2,1), v(5,1)), 't1').toBe(equalTo(1));
  expect(search.line.distance(v(2,1), v(2,1), v(5,1)), 't2').toBe(equalTo(0));
  expect(search.line.distance(v(3,1), v(2,1), v(5,1)), 't3').toBe(equalTo(0));
  expect(search.line.distance(v(3,0), v(2,1), v(5,1)), 't4').toBe(equalTo(1));
  expect(search.line.distance(v(3,0), v(5,1), v(2,1)), 't4.5').toBe(equalTo(1));
  expect(search.line.distance(v(5,1), v(2,1), v(5,1)), 't5').toBe(equalTo(0));
  expect(search.line.distance(v(6,1), v(2,1), v(5,1)), 't6').toBe(equalTo(1));

  expect(search.line.distance(v(-0.401,-0.312), v(-0.417,-0.317), v(-0.400,-0.317)), 't7').toBe(lessThan(0.017));
  expect(search.line.distance(v(-0.35048,0.19514,0.80000), v(-0.36000,0.20000,0.80000), v(-0.35000,0.20000,0.80000)), 't8').toBe(lessThan(0.01));
  expect(search.line.distance(v(-0.35048,0.19514,0.80000), v(-0.35000,0.20000,0.80000), v(-0.36000,0.20000,0.80000)), 't9').toBe(lessThan(0.01));
};

tests.nearestPointOnLine = function () {
  var v = (x,y) => new vector(x,y);
  expect(search.line.nearestPoint(v(1,1), v(2,1), v(5,1)), 't1').toBe(sameAs(v(2,1)));
  expect(search.line.nearestPoint(v(2,1), v(2,1), v(5,1)), 't2').toBe(sameAs(v(2,1)));
  expect(search.line.nearestPoint(v(3,1), v(2,1), v(5,1)), 't3').toBe(sameAs(v(3,1)));
  expect(search.line.nearestPoint(v(3,0), v(2,1), v(5,1)), 't4').toBe(sameAs(v(3,1)));
  expect(search.line.nearestPoint(v(3,0), v(5,1), v(2,1)), 't4.5').toBe(sameAs(v(3,1)));
  expect(search.line.nearestPoint(v(5,1), v(2,1), v(5,1)), 't5').toBe(sameAs(v(5,1)));
  expect(search.line.nearestPoint(v(6,1), v(2,1), v(5,1)), 't6').toBe(sameAs(v(5,1)));
};

tests.nearestPointsOnToolpath2D = function () {
  var v = (x,y) => ({pos: new vector(x,y)});
  var a=v(1,1), b=v(1,3), c=v(2,3), d=v(2,1);
  var tp = [ a, b, c, d, a ];
  expect(search.toolpath.nearestPoints2D(v(1,2).pos, tp), 't1').toBe(sameAs([a.pos,b.pos]));
};

return function () {
  for (name in tests) {
    console.log('analysis-search '+name+' ');
    tests[name]();
  }
};

});
