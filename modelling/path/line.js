define(function(require) {

var vector = require('vector');
var bottom = require('modelling/bottom');

return function (x1, y1, x2, y2) {
  return function (x,y) {
    var p = new vector(x, y, 0);
    var p2 = new vector(x2, y2, 0);
    var p1 = new vector(x1, y1, 0);
    var line = p2.subtract(p1);
    var pos = p.subtract(p1);
    var distanceAlongLine = line.dot(pos);
    var param = -1;
    if (!line.isZero()) { param = distanceAlongLine / line.sqrLength(); }
    var isInSegment = (param >= 0 && param <= 1);
    if (!isInSegment) {
      return {
        param: param,
        perpDistance: Infinity,
        cutDir: bottom(x,y).cutDir,
        perpDir: bottom(x,y).cutDir,
        curvature: 0
      };
    }
    var nearestPointOnSegment = p1.add(line.multiply(param));
    var perp = p.subtract(nearestPointOnSegment);
    var side = perp.dot(new vector(-line.y, line.x, 0));
    return {
      param: param,
      perpDistance: perp.length(),
      cutDir: line.unit().multiply(side<0 ? 1 : -1),
      perpDir: perp.unit(),
      curvature: 0
    };
  };
};

});
