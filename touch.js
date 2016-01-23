define(function(require) {

var touch = {
  pan: function () {},
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

var mousedown = false;
var mx, my;
window.onmousedown = function (evt) {
  mousedown = true;
  mx = evt.clientX;
  my = evt.clientY;
};
window.onmousemove = function (evt) {
  if (mousedown) {
    touch.pan(evt.clientX - mx, evt.clientY - my);
    mx = evt.clientX;
    my = evt.clientY;
  }
};
window.onmouseup = function (evt) {
  mousedown = false;
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
