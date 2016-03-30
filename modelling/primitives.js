define(function(require) {

var vector = require('vector');
var bottom = require('modelling/bottom');

var abs = Math.abs;
var sign = Math.sign;
var sqrt = Math.sqrt;

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
  var perpCurvature = 1/radius;
  return function (x, y) {
    var x2 = x*x;
    var y2 = y*y;
    if (x2 + y2 > r2) { return bottom(x,y); }
    var z = sqrt(r2 - x2 - y2);
    var pos = new vector(x, y, z);
    return {
      pos: pos,
      norm: pos.unit(),
      cutDir: new vector(-y, x, 0).unit(),
      cutCurvature: 1/z,
      perpCurvature: perpCurvature
    };
  };
};

primitives.sweep = function (pathFn, profileFn, scaleFn) {
  return function (x, y) {
    var path = pathFn(x, y);
    if (path === null) { return bottom(x,y); }
    var scale = scaleFn(path.param);
    var profile = profileFn(path.perpDistance, scale.scale);
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
