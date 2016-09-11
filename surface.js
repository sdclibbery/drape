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
//              prim.cube(100),
//              prim.sphere(50),
//              prim.sweep(line(0,100, 0,-100), ellipse(70, 70), power(0.25)),
//              translate(150, 150, prim.cube(100)),
//              translate(200, 120, prim.sphere(90)),
//              translate(100, 100, prim.cube(100)),
              prim.sweep(bezier(25,50, -75,80, 75,-80, -25,-50), ellipse(5, 12), power(0.25)),
              prim.sweep(bezier(25,50, -75,80, 75,-80, -25,-50), ellipse(12, 5), power(0.25)),
            ]));
surface.size = 160;

return surface;

});
