define(function(require) {

var drawMesh = require('draw/mesh');
var drawLines = require('draw/lines');
var triangulate = require('draw/triangulate');
var cutDirLines = require('draw/cutdirlines');
var toolpathLines = require('draw/toolpathlines');
var touch = require('input/touch');
var mouse = require('input/mouse');
var surface = require('surface');
var camera = require('camera').distance(surface.size*1.2);
var toolpath = require('cnc/toolpath');
var tool = require('cnc/tool/ballend')(3.125);
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

var toolpath = toolpath(surface, tool);
var drawSurface = drawMesh(ctxGl, triangulate(surface));
var drawCutDir = drawLines(ctxGl, cutDirLines(surface), 0,0.7,0.7);
var drawToolPath = drawLines(ctxGl, toolpathLines(toolpath), 1,0,1);
var render = function () {
  var ms = camera.toMatrices(canvas.width, canvas.height);
  drawSurface(ctxGl, ms.view, ms.perspective);
  drawCutDir(ctxGl, ms.view, ms.perspective);
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
