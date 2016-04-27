define(function(require) {

var vector = require('vector');
var bottom = require('modelling/bottom');

var sgn = x => (x<0) ? -1 : 1;

return function (x1, y1, x2, y2) {
  return function (x,y) {
    var p = new vector(x, y);
    var p2 = new vector(x2, y2);
    var p1 = new vector(x1, y1);
    var line = p2.subtract(p1);
    var pos = p.subtract(p1);
    var distanceAlongLine = line.dot(pos);
    var param = -1;
    if (!line.isZero()) { param = distanceAlongLine / line.sqrLength(); }
    var isInSegment = (param >= 0 && param <= 1);
    if (!isInSegment) {
      return null;
    }
    var nearestPointOnSegment = p1.add(line.multiply(param));
    var perp = p.subtract(nearestPointOnSegment);
    var side = -sgn(perp.dot(new vector(-line.y, line.x)));
    return {
      param: param,
      perpDistance: perp.length(),
      cutDir: line.unit().multiply(side),
      perpDir: perp.unit().multiply(side),
      side: side,
      length: line.length()
    };
  };
};

});
