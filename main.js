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

var pitch = 45;
var yaw = 45;
var touchx, touchy;

var render = function () {
  camera.set(canvas.width, canvas.height, yaw, pitch);
  drawMesh(ctxGl, mesh, camera.view, camera.perspective);
  drawLines(ctxGl, lines, camera.view, camera.perspective);
};
render();

touch.start = function (x, y) { touchx = x; touchy = y; }
touch.move = function (x, y) {
	yaw += (x - touchx)/2;
	pitch += (y - touchy)/2;
	touchx = x; touchy = y;
  render();
};

});
