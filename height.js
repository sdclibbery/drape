define(function(require) {

return function (x, y) {
  return Math.max(10 - 0.03*(x*x + y*y), 0);
};

});
