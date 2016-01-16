define(function(require) {

var drawMesh = require('drawMesh');
var triangulate = require('triangulate');
var touch = require('touch');
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

var pitch = 45;
var yaw = 45;
var touchx, touchy;
drawMesh(ctxGl, canvas.width, canvas.height, mesh, pitch, yaw);
touch.start = function (x, y) { touchx = x; touchy = y; }
touch.move = function (x, y) {
	yaw += (x - touchx)/2;
	pitch += (y - touchy)/2;
	touchx = x; touchy = y;
	drawMesh(ctxGl, canvas.width, canvas.height, mesh, pitch, yaw);
};

});
