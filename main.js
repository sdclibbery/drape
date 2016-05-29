define(function(require) {

var drawMesh = require('draw/mesh');
var drawLines = require('draw/lines');
var triangulate = require('draw/triangulate');
var cutDirLines = require('draw/cutdirlines');
var toolpathLines = require('draw/toolpathlines');
var touch = require('input/touch');
var mouse = require('input/mouse');
var camera = require('camera');
var surface = require('surface');
var toolpath = require('cnc/toolpath');
var gcode = require('cnc/gcode');

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

var toolpath = toolpath(surface);
var drawSurface = drawMesh(ctxGl, triangulate(surface));
var drawCutDir = drawLines(ctxGl, cutDirLines(surface));
var drawToolPath = drawLines(ctxGl, toolpathLines(toolpath));
var render = function () {
  var ms = camera.toMatrices(canvas.width, canvas.height);
  drawSurface(ctxGl, ms.view, ms.perspective);
//  drawCutDir(ctxGl, ms.view, ms.perspective);
  drawToolPath(ctxGl, ms.view, ms.perspective);
};
render();

window.export = function () {
  var code = gcode(toolpath);
  newWindow = window.open("data:text/plain," + encodeURIComponent(code), "_blank");
  newWindow.document.title = "draped.gcode";
  newWindow.focus();
}

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
