define(function(require) {

var abs = Math.abs;
var pow = Math.pow;

return function (p) {
  return function (d) {
    return {
      scale: pow(1 - abs(1-d*2), p)
    }
  }
};

});
