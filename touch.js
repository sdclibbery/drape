define(function(require) {

var touch = {
  start: function () {},
  move: function () {},
  end: function () {},
};

var touched = false;
var mousedown = false;
window.onmousedown = function (evt) {
  if (touched) { return; }
  mousedown = true;
  touch.start(evt.clientX, evt.clientY);
};
window.onmousemove = function (evt) {
  if (touched) { return; }
  if (mousedown) {
    touch.move(evt.clientX, evt.clientY);
  }
};
window.onmouseup = function (evt) {
  if (touched) { return; }
  touch.end();
  mousedown = false;
};

window.addEventListener("touchstart", function (evt) {
  touched = true;
  touch.start(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
});
window.addEventListener("touchmove", function (evt) {
  touch.move(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
});
window.addEventListener("touchend", function (evt) {
  touch.end();
});

return touch;
});
