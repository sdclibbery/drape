define(function(require) {

var mouse = {
  drag: function () {},
};

var mousedown = false;
var mx, my;
window.onmousedown = function (evt) {
  mousedown = true;
  mx = evt.clientX;
  my = evt.clientY;
};
window.onmousemove = function (evt) {
  if (mousedown) {
    mouse.drag(evt.clientX - mx, evt.clientY - my);
    mx = evt.clientX;
    my = evt.clientY;
  }
};
window.onmouseup = function (evt) {
  mousedown = false;
};

return mouse;
});
