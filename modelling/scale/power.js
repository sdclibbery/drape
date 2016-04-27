define(function(require) {

var abs = Math.abs;
var sgn = x => (x<0) ? -1 : 1;
var pow = Math.pow;

return function (p) {
  return function (d) {
    var x = 1 - d*2;
    var t = 1 - abs(x);
    return {
      scale: pow(t, p),
      gradient: sgn(x) * p * pow(t, p-1)
    }
  }
};

});
