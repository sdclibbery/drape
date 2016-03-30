define(function(require) {

var line = require('modelling/path/line');

var v2s = function (v) {
  return '(' + v.x.toFixed(3) + ',' + v.y.toFixed(3) + ')';
};

var assert = function (res, x,y, pred, m) {
  if (!pred(res)) { console.log(m+' at ' + v2s({x:x, y:y})); }
};

var nearTo = function (v1, v2, eps) {
  return abs(v2-v1) < eps;
}

var test = function (path) {
  for (var i=0; i<100; i++) {
    var x = 1*(Math.random()-0.5);
    var y = 1*(Math.random()-0.5);
    var res = path(x,y);
    assert(res, x,y, r => r.param >= 0 && r.param <= 1, "param in range");
  }
};

var testSuites = {};

testSuites.line = function () {
  test(line(0,-0.5, 0,0.5));
};

return function () {
  for (name in testSuites) {
    console.log(name);
    testSuites[name]();
  }
};

});
