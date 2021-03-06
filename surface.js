define(function(require) {

var Vector = require('vector');
var prim = require('modelling/primitives');
var ellipse = require('modelling/profile/ellipse');
var line = require('modelling/path/line');
var bezier = require('modelling/path/bezier');
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

var surface = translate(0, 0, csg.union([
//              prim.cube(70),
//              prim.sphere(50),
//              prim.sweep(line(10,70, -10,-70), ellipse(20, 30), power(0.25)),
              translate(50, 50, prim.cube(40)),
              translate(66, 40, prim.sphere(30)),
              translate(35, 35, prim.cube(40)),
              prim.sweep(bezier(25,50, -75,80, 75,-80, -25,-50), ellipse(5, 12), power(0.25)),
              prim.sweep(bezier(25,50, -75,80, 75,-80, -25,-50), ellipse(12, 5), power(0.25)),
            ]));
surface.size = 160;

return surface;

});
