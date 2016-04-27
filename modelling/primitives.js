define(function(require) {

var vector = require('vector');
var bottom = require('modelling/bottom');

var abs = Math.abs;
var sgn = x => (x<0) ? -1 : 1;
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
      cutDir: new vector(cutX, cutY)
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
      cutDir: new vector(-y, x).unit()
    };
  };
};

primitives.sweep = function (pathFn, profileFn, scaleFn) {
  return function (x, y) {
    var path = pathFn(x, y);
    if (path === null) { return bottom(x,y); }
    var scale = scaleFn(path.param);
    var profile = profileFn(path.perpDistance, scale.scale);
    var aspect = profile.w/path.length;
    var perpScaleOffset = path.perpDir.multiply(aspect*scale.gradient); // If the path curves, this won't account for it ! Also doesn't account for 'end caps'
    return {
      pos: new vector(x, y, profile.height),
      cutDir: path.cutDir.add(perpScaleOffset).unit()
    };
  };
};

return primitives;

});
