define(function(require) {

var Vector = require('vector');
var prim = require('modelling/primitives');
var ellipse = require('modelling/profile/ellipse');
var line = require('modelling/path/line');
var power = require('modelling/scale/power');
var csg = require('modelling/csg');
var bottom = require('modelling/bottom');

var translate = function (tx, ty, f) {
  return function (x,y) {
    var s = f(x-tx, y-ty);
    s.pos = s.pos.add(new Vector(tx, ty, 0));
    return s;
  };
};

return csg.union([
              translate(0.15, 0.15, prim.cube(0.1)),
              translate(0.12, 0.12, prim.sphere(0.09)),
              translate(0.1, 0.1, prim.cube(0.1)),
              prim.sweep(line(0,0.1, 0,-0.1), ellipse(0.07, 0.07), power(0.25)),
            ]);

});
