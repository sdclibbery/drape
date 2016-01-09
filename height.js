define(function(require) {

return function (x, y) {
  if (x*x + y*y > 300) { return 0; }
  return Math.sin(x) + Math.sin(y);
};

});
