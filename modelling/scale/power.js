define(function(require) {

var abs = Math.abs;
var sgn = x => (x<0) ? -1 : 1;
var pow = Math.pow;

return function (p) {
  return function (d) {
    var x = 1 - d*2;
    return {
      scale: pow(1 - abs(x), p),
      gradient: sgn(x) * p * pow(1 - abs(x), p-1)
    }
  }
};

});
