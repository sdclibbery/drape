define(function(require) {

var PI = Math.PI;
var abs = Math.abs;
var min = Math.min;
var max = Math.max;
var sin = Math.sin;
var cos = Math.cos;

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

return drape([
              rotate(PI/4, cube(10))
//              sweep(ellipse(3, 5)).from(-10,-10).to(10,10)
            ]);

});
