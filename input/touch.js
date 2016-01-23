define(function(require) {

var touch = {
  pan: function () {},
  pinch: function () {}
};

var touches = {};
window.addEventListener("touchstart", function (evt) {
  evt.preventDefault();
  toArray(evt.changedTouches).map(function (touch) {
    touches[touch.identifier] = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
  });
});
window.addEventListener("touchmove", function (evt) {
  evt.preventDefault();
  toArray(evt.changedTouches).map(function (changed) {
    var t = touches[changed.identifier];
    var shouldPan = Object.keys(touches).length == 1;
    if (shouldPan) {
      touch.pan(changed.clientX - t.x, changed.clientY - t.y);
    }
    var shouldPinch = Object.keys(touches).length == 2;
    if (shouldPinch) {
      var oldx = changed.clientX;
      var oldy = changed.clientY;
      touch.pinch(Math.sqrt(oldx*oldx + oldy*oldy) - Math.sqrt(t.x*t.x + t.y*t.y));
    }
    t.x = changed.clientX;
    t.y = changed.clientY;
  });
});
window.addEventListener("touchend", function (evt) {
  evt.preventDefault();
  toArray(evt.changedTouches).map(function (touch) {
    delete touches[touch.identifier];
  });
});

var toArray = function (a) {
  var r = [];
  for (var i=0; i<a.length; i++) {
    r.push(a[i]);
  }
  return r;
};

return touch;
});
