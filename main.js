define(function(require) {

var drawMesh = require('drawMesh');
var drawLines = require('drawLines');
var triangulate = require('triangulate');
var cutLines = require('cutlines');
var touch = require('touch');
var camera = require('camera');
var surface = require('surface');

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

var mesh = triangulate(surface);
var lines = cutLines(surface);

var render = function () {
  var ms = camera.toMatrices(canvas.width, canvas.height);
  drawMesh(ctxGl, mesh, ms.view, ms.perspective);
  drawLines(ctxGl, lines, ms.view, ms.perspective);
};
render();

touch.pan = function (dx, dy) {
  camera.pan(dx, dy);
  render();
};

var touchx, touchy;
touch.start = function (touches) { touchx = touches[0].x; touchy = touches[0].y; }
touch.move = function (touches) {
	touch.pan(touches[0].x - touchx, touches[0].y - touchy);
	touchx = touches[0].x;
  touchy = touches[0].y;
};

});
