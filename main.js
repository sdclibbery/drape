define(function(require) {

var drawMesh = require('draw/mesh');
var drawLines = require('draw/lines');
var triangulate = require('draw/triangulate');
var cutLines = require('draw/cutlines');
var touch = require('input/touch');
var mouse = require('input/mouse');
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
mouse.drag = function (dx, dy) {
  camera.pan(dx, dy);
  render();
};

touch.pinch = function (dz) {
  camera.zoom(dz);
  render();
};

});
