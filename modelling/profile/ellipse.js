define(function(require) {

var min = Math.min;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;
var lerp = function (v1, v2, p) { return v1 + (v2-v1)*min(max(p,0),1); };

return function (hw, hh) {
  return function (x, s) {
    var hws = hw*s;
    var hhs = hh*s;
    var p = abs(x)/hws;
    if (p >= 1) {
      return {
        height: 0,
        gradient: 0,
        curvature: 0
      };
    }
    var y = sqrt((1 - p*p) * hhs*hhs);
    var nx = y/(hhs*hhs);
    var ny = abs(x)/(hws*hws);
    return {
      height: y,
      gradient: ny/nx,
      w: hw*2,
      curvature: lerp(1/hws, 1/hhs, p) // Is this anything like right..??
    };
  };
};

});
