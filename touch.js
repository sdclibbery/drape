define(function(require) {

var touch = {
  pan: function () {},
};

var touchx, touchy;
var touchStart = function (touches) {
  touchx = touches[0].x;
  touchy = touches[0].y;
};
var touchMove = function (touches) {
	touch.pan(touches[0].x - touchx, touches[0].y - touchy);
	touchx = touches[0].x;
  touchy = touches[0].y;
};
var touchEnd = function () {}

window.addEventListener("touchstart", function (evt) {
  evt.preventDefault();
  touchStart([{x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY}]);
});
window.addEventListener("touchmove", function (evt) {
  evt.preventDefault();
  touchMove([{x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY}]);
});
window.addEventListener("touchend", function (evt) {
  evt.preventDefault();
  touchEnd();
});

var mousedown = false;
window.onmousedown = function (evt) {
  mousedown = true;
  touchStart([{x: evt.clientX, y: evt.clientY}]);
};
window.onmousemove = function (evt) {
  if (mousedown) {
    touchMove([{x: evt.clientX, y: evt.clientY}]);
  }
};
window.onmouseup = function (evt) {
  touchEnd();
  mousedown = false;
};

return touch;
});
