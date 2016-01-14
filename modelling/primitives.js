define(function(require) {

var vector = require('vector');
var bottom = require('modelling/bottom');

var PI = Math.PI;
var abs = Math.abs;
var min = Math.min;
var max = Math.max;
var sin = Math.sin;
var cos = Math.cos;
var sqrt = Math.sqrt;
var inf = Infinity;

var primitives = {};

primitives.cube = function (size) {
  return function (x, y) {
    if (abs(x) > size/2 || abs(y) > size/2) { return bottom(x,y); }
    var nearestToY = abs(x) > abs(y);
    var tanX = nearestToY ? 0 : 1;
    var tanY = nearestToY ? 1 : 0;
    return {
      pos: new vector(x,y,size),
      norm: new vector(0,0,1),
      cutDir: new vector(tanX, tanY, 0),
      cutCurvature: 0,
      perpCurvature: 0
    };
  };
};

primitives.sphere = function (radius) {
  var r2 = radius*radius;
  return function (x, y) {
    var x2 = x*x;
    var y2 = y*y;
    if (x2 + y2 > r2) { return bottom(x,y); }
    var pos = new vector(x, y, sqrt(r2 - x2 - y2));
    return {
      pos: pos,
      norm: pos.unit(),
// ! need to sort these and think about testing. How about some property based testing? eg test norm is perp to tan etc
//      cutDir: new vector(),
//      cutCurvature: ,
//      perpCurvature: 
    };
  };
};

/*
var ellipse = function (hw, hh) {
  return function (x) {
    x = abs(x);
    if (x >= hw) { return 0; }
    return sqrt((1 - x*x/(hw*hw)) * hh*hh);
  };
};

primitives.line = function (x1, y1, x2, y2) {
  return function (x,y) {
    // calculate perpendicular distance from 
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) { param = dot / len_sq; }; // in case of 0 length line
    if (param < 0 || param > 1) { return inf; } // outside of line segment
    var xx, yy;
    xx = x1 + param * C;
    yy = y1 + param * D;
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx*dx + dy*dy);
  };
};

primitives.sweep = function (path, profile) {
  return function (x, y) {
    var dist = path(x, y);
    //!! Need to scale the profile along the path...
    return profile(dist);
  };
};
*/

return primitives;

});
