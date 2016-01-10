define(function(require) {

var PI = Math.PI;
var abs = Math.abs;
var min = Math.min;
var max = Math.max;
var sin = Math.sin;
var cos = Math.cos;
var sqrt = Math.sqrt;
var inf = Infinity;

var drape = function (items) {
  return function (x,y) {
    return items.reduce(function (h, f) {
      return max(h, f(x, y));
    }, 0);
  };
};

var translate = function (tx, ty, f) {
  return function (x,y) {
    return f(x-tx, y-ty);
  };
};

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

var cube = function (size) {
  return function (x, y) {
    if (abs(x) <= size/2 && abs(y) <= size/2) { return size; }
    return 0;
  };
};

var ellipse = function (hw, hh) {
  return function (x) {
    x = abs(x);
    if (x >= hw) { return 0; }
    return sqrt((1 - x*x/(hw*hw)) * hh*hh);
  };
};

var line = function (x1, y1, x2, y2) {
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

var sweep = function (path, profile) {
  return function (x, y) {
    var dist = path(x, y);
    //!! Need to scale the profile along the path...
    return profile(dist);
  };
};

return drape([
//              rotate(PI/4, cube(10)),
//              translate(5, 5, cube(12))
              sweep(line(-10,-10, 10,10), ellipse(3, 5))
            ]);

});
