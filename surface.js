define(function(require) {

var prim = require('modelling/primitives');
var bottom = require('modelling/bottom');

var sin = Math.sin;
var cos = Math.cos;

var union = function (items) {
  return function (x,y) {
    return items.reduce(function (v, f) {
      var s = f(x, y);
      return (s.pos.z > v.pos.z) ? s : v;
    }, bottom(x,y));
  };
};

/*
var translate = function (tx, ty, f) {
  return function (x,y) {
    return f(x-tx, y-ty);
  };
};

var rotate = function (a, f) {
  return function (x,y) {
    return f(x*cos(a) + y*sin(a), -x*sin(a) + y*cos(a));
  };
};

var scale = function (s, f) {
  return function (x,y) {
    return f(x/s, y/s);
  };
};

*/
return union([
//              prim.cube(10)
              prim.sphere(10)
//              rotate(PI/4, prim.cube(10))
//              translate(5, 5, prim.cube(12))
//              prim.sweep(prim.line(-10,-10, 10,10), prim.ellipse(3, 5))
            ]);

});
