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
  var lerp = function (v1, v2, p) { return v1 + (v2-v1)*min(max(p,0),1); };
  return function (x) {
    var p = abs(x)/hw;
    if (p >= 1) {
      return {
        height: 0,
        gradient: 0,
        curvature: 0
      };
    }
    var y = sqrt((1 - p*p) * hh*hh);
    var nx = y/(hh*hh);
    var ny = abs(x)/(hw*hw);
    return {
      height: y,
      gradient: ny/nx,
      curvature: lerp(1/hw, 1/hh, p) // Is this anything like right..??
    };
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
        cutDir: bottom(x,y).cutDir,
        perpDir: bottom(x,y).cutDir,
        curvature: 0
      };
    }
    var nearestPointOnSegment = p1.add(line.multiply(param));
    var perp = p.subtract(nearestPointOnSegment);
    var side = perp.dot(new vector(-line.y, line.x, 0));
    return {
      distance: perp.length(),
      cutDir: line.unit().multiply(side<0 ? 1 : -1),
      perpDir: perp.unit(),
      curvature: 0
    };
  };
};

primitives.sweep = function (pathFn, profileFn) {
  return function (x, y) {
    var path = pathFn(x, y);
    var profile = profileFn(path.distance);
    return {
      pos: new vector(x, y, profile.height),
      norm: profile.gradient==0 ? new vector(0,0,1) : path.perpDir.add(new vector(0,0,1/profile.gradient)).unit(),
      cutDir: path.cutDir,
      cutCurvature: path.curvature,
      perpCurvature: profile.curvature
    };
  };
};

return primitives;

});
