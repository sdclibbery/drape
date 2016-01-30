define(function(require) {

var vector = require('vector');
var bottom = require('modelling/bottom');

var PI = Math.PI;
var abs = Math.abs;
var sign = Math.sign;
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
    var nearestToXAxis = abs(x) > abs(y);
    var cutX = nearestToXAxis ? 0 : -sign(y);
    var cutY = nearestToXAxis ? sign(x) : 0;
    return {
      pos: new vector(x,y,size),
      norm: new vector(0,0,1),
      cutDir: new vector(cutX, cutY, 0),
      cutCurvature: 0,
      perpCurvature: 0
    };
  };
};

primitives.sphere = function (radius) {
  var r2 = radius*radius;
  var curvature = 1/radius;
  return function (x, y) {
    var x2 = x*x;
    var y2 = y*y;
    if (x2 + y2 > r2) { return bottom(x,y); }
    var pos = new vector(x, y, sqrt(r2 - x2 - y2));
    return {
      pos: pos,
      norm: pos.unit(),
      cutDir: new vector(-y, x, 0).unit(),
      cutCurvature: curvature,
      perpCurvature: curvature
    };
  };
};

primitives.ellipse = function (hw, hh) {
  return function (x) {
    if (abs(x) >= hw) { return 0; }
    return sqrt((1 - x*x/(hw*hw)) * hh*hh);
  };
};

primitives.line = function (x1, y1, x2, y2) {
  return function (x,y) {
    // calculate perpendicular distance
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) { param = dot / len_sq; }; // in case of 0 length line
    if (param < 0 || param > 1) {  // outside of line segment
      return {
        distance: Infinity,
        cutDir: bottom(x,y).cutDir
      };
    }
    var xx, yy;
    xx = x1 + param * C;
    yy = y1 + param * D;
    var dx = x - xx;
    var dy = y - yy;
    return {
      distance: Math.sqrt(dx*dx + dy*dy),
      cutDir: new vector(-C, -D, 0).unit(),
      cutCurvature: 0,
    };
  };
};

primitives.sweep = function (path, profile) {
  return function (x, y) {
    var info = path(x, y);
    var z = profile(info.distance);
    return {
      pos: new vector(x,y,z),
      norm: new vector(0,0,1),
      cutDir: info.cutDir,
      cutCurvature: info.cutCurvature,
      perpCurvature: 0
    };
  };
};

return primitives;

});
