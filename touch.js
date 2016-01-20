define(function(require) {

var touch = {
  start: function () {},
  move: function () {},
  end: function () {},
};

var mousedown = false;
window.onmousedown = function (evt) {
  mousedown = true;
  touch.start([{x: evt.clientX, y: evt.clientY}]);
};
window.onmousemove = function (evt) {
  if (mousedown) {
    touch.move([{x: evt.clientX, y: evt.clientY}]);
  }
};
window.onmouseup = function (evt) {
  touch.end();
  mousedown = false;
};

window.addEventListener("touchstart", function (evt) {
  evt.preventDefault();
  touch.start([{x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY}]);
});
window.addEventListener("touchmove", function (evt) {
  evt.preventDefault();
  touch.move([{x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY}]);
});
window.addEventListener("touchend", function (evt) {
  evt.preventDefault();
  touch.end();
});

return touch;
});
