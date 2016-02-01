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
    var p = new vector(x, y, 0);
    var p2 = new vector(x2, y2, 0);
    var p1 = new vector(x1, y1, 0);
    var line = p2.subtract(p1);
    var pos = p.subtract(p1);
    var distanceAlongLine = line.dot(pos);
    var param = -1;
    if (!line.isZero()) { param = distanceAlongLine / line.sqrLength(); }
    var isInSegment = (param >= 0 && param <= 1);
    if (!isInSegment) {
      return {
        distance: Infinity,
        cutDir: bottom(x,y).cutDir
      };
    }
    var nearestPointOnSegment = p1.add(line.multiply(param));
    var perp = p.subtract(nearestPointOnSegment);
    var side = perp.dot(new vector(-line.y, line.x, 0));
    return {
      distance: perp.length(),
      cutDir: line.unit().multiply(side<0?1:-1),
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
