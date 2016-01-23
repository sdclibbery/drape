define(function(require) {

var mouse = {
  pan: function () {},
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
    mouse.pan(evt.clientX - mx, evt.clientY - my);
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

return mouse;
});
