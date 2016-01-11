define(function(require) {

var bottom = require('modelling/bottom');

var csg = {};

csg.union = function (items) {
  return function (x,y) {
    return items.reduce(function (v, f) {
      var s = f(x, y);
      return (s.pos.z > v.pos.z) ? s : v;
    }, bottom(x,y));
  };
};

return csg;

});
