define(function(require) {

var touch = {
  pan: function () {},
  pinch: function () {}
};

var touches = {};
window.addEventListener("touchstart", function (evt) {
  evt.preventDefault();
  toArray(evt.changedTouches).map(function (touch) {
    touches[touch.identifier] = {
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      prevx: touch.clientX,
      prevy: touch.clientY
    };
  });
});
window.addEventListener("touchmove", function (evt) {
  evt.preventDefault();
  toArray(evt.changedTouches).map(function (changed) {
    var t = touches[changed.identifier];
    t.prevx = t.x;
    t.prevy = t.y;
    t.x = changed.clientX;
    t.y = changed.clientY;
  });
  tryPan(touches);
  tryPinch(touches);
});
window.addEventListener("touchend", function (evt) {
  evt.preventDefault();
  toArray(evt.changedTouches).map(function (touch) {
    delete touches[touch.identifier];
  });
});

var tryPan = function (touches) {
  if (Object.keys(touches).length == 1) {
    var t = touches[Object.keys(touches)[0]];
    touch.pan(t.x - t.prevx, t.y - t.prevy);
  }
};

var tryPinch = function (touches) {
  if (Object.keys(touches).length == 2) {
    var t1 = touches[Object.keys(touches)[0]];
    var t2 = touches[Object.keys(touches)[1]];
    var prevDist = distance(t1.prevx - t2.prevx, t1.prevy - t2.prevy);
    var dist = distance(t1.x - t2.x, t1.y - t2.y);
    touch.pinch(dist - prevDist);
  }
};

var distance = function (dx, dy) {
  return Math.sqrt(dx*dx + dy*dy);
};

var toArray = function (a) {
  var r = [];
  for (var i=0; i<a.length; i++) {
    r.push(a[i]);
  }
  return r;
};

return touch;
});
