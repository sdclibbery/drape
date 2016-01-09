define(function(require) {

var draw = require('draw');
var triangulate = require('triangulate');

var canvas = document.getElementById("canvas");
function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener('resize', onResize, false);
onResize();

var ctxGl = canvas.getContext("webgl");
if (!ctxGl) { ctxGl = canvas.getContext("experimental-webgl"); }
if (!ctxGl) { document.getElementById('info').innerHTML = 'WebGL not supported!'; }

ctxGl.clearColor(0.3, 0.3, 0.3, 1);
ctxGl.enable(ctxGl.DEPTH_TEST);
ctxGl.depthFunc(ctxGl.LEQUAL);
ctxGl.clear(ctxGl.COLOR_BUFFER_BIT|ctxGl.DEPTH_BUFFER_BIT);

var height = function (x, y) {
  return Math.sin(x) + Math.sin(y);
};

var mesh = triangulate(height);

draw(ctxGl, canvas.width, canvas.height, mesh);

});
