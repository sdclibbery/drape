define(function(require) {

var bezier = require('modelling/bezier/bezier');
var vector = require('vector');
var bottom = require('modelling/bottom');

var sgn = x => x<0 ? -1 : 1;
var vec = (x,y) => new vector(x, y);
var unitVec = p => new vector(p.x, p.y).unit();

return function (x1,y1, cx1,cy1, cx2,cy2, x2,y2) {
  var b = new bezier(x1,y1, cx1,cy1, cx2,cy2, x2,y2);
  return function (x,y) {
    var p = b.project({x:x, y:y});
    if (p.t <= 0 || p.t >= 1) {
      return null;
    }
    var cd = unitVec(b.derivative(p.t));
    var pd = unitVec(b.normal(p.t));
    var v = vec(p.x,p.y).subtract(vec(x,y));
    var side = sgn(pd.dot(v));
    return {
      param: p.t,
      perpDistance: p.d,
      cutDir: cd.multiply(side),
      perpDir: pd.negative(),
      length: b.length()
    };
  };
};

});
