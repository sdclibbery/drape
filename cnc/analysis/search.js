define(function(require) {

var search = {};

search.distanceToLine2D = function (p, a, b) {
  return search.distanceToLine(p.as2D(), a.as2D(), b.as2D());
};

search.distanceToLine = function (p, a, b) {
  var nearest = search.nearestPointOnLine(p, a, b);
  return nearest.subtract(p).length();
};

search.nearestPointOnLine = function (p, a, b) {
  var line = b.subtract(a);
  var dir = line.unit();
  var pa = p.subtract(a);
  var param = pa.dot(dir);
  if (param <= 0) { return a; }
  if (param >= line.length()) { return b; }
  return a.add(dir.multiply(param));
},

search.nearestPointsOnToolpath2D = function (p, toolpath) {
  var bestDistance = Infinity;
  var bestPoints = [];
  toolpath.map(function (_, idx) {
    if (idx === 0) { return; }
    var a = toolpath[idx].pos;
    var b = toolpath[idx-1].pos;
    var distance = search.distanceToLine2D(p, a, b);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPoints = [b, a];
    }
  });
  return bestPoints;
};

return search;

});
