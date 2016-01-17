define(function(require) {

var prim = require('modelling/primitives');
var csg = require('modelling/csg');
var bottom = require('modelling/bottom');

/*
var translate = function (tx, ty, f) {
  return function (x,y) {
    return f(x-tx, y-ty);
  };
};

var sin = Math.sin;
var cos = Math.cos;

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

return csg.union([
              prim.cube(0.2)
//              prim.sphere(0.2)
//              rotate(PI/4, prim.cube(10))
//              translate(5, 5, prim.cube(12))
//              prim.sweep(prim.line(-10,-10, 10,10), prim.ellipse(3, 5))
            ]);

});
