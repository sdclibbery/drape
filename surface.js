define(function(require) {

var Vector = require('vector');

var PI = Math.PI;
var abs = Math.abs;
var min = Math.min;
var max = Math.max;
var sin = Math.sin;
var cos = Math.cos;
var sqrt = Math.sqrt;
var inf = Infinity;

var bottom = function (x, y) {
  return {
    pos: new Vector(x,y,0),
    norm: new Vector(0,0,1)
  };
}

var drape = function (items) {
  return function (x,y) {
    return items.reduce(function (v, f) {
      var s = f(x, y);
      return (s.pos.z > v.pos.z) ? s : v;
    }, bottom(x,y));
  };
};

var cube = function (size) {
  return function (x, y) {
    if (abs(x) > size/2 || abs(y) > size/2) { return bottom(x,y); }
    var nearestToY = abs(x) > abs(y);
    var tanX = nearestToY ? 0 : 1;
    var tanY = nearestToY ? 1 : 0;
    return {
      pos: new Vector(x,y,size),
      norm: new Vector(0,0,1),
      tangent: new Vector(tanX, tanY, 0),
      tangentCurvature: 0,
      cotangentCurvature: 0
    };
  };
};

var sphere = function (radius) {
  var r2 = radius*radius;
  return function (x, y) {
    var x2 = x*x;
    var y2 = y*y;
    if (x2 + y2 > r2) { return bottom(x,y); }
    var pos = new Vector(x, y, sqrt(r2 - x2 - y2));
    return {
      pos: pos,
      norm: pos.unit(),
// ! need to sort these and think about testing. How about some property based testing? eg test norm is perp to tan etc
//      tangent: new Vector(),
//      tangentCurvature: ,
//      cotangentCurvature: 
    };
  };
};

/*
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
*/
return drape([
//              cube(10)
              sphere(10)
//              rotate(PI/4, cube(10))
//              translate(5, 5, cube(12))
//              sweep(line(-10,-10, 10,10), ellipse(3, 5))
            ]);

});
