define(function(require) {

  var Matrix = require('matrix');
  var Vector = require('vector');

  var camera = {
    pitch: 45,
    yaw: 45,
    fovy: 1.1
  };

  camera.pan = function (dx, dy) {
    this.yaw += dx*0.5;
    this.pitch += dy*0.5;
  };

  camera.zoom = function (dz) {
    this.fovy += dz*0.01;
  };

  camera.toMatrices = function (cw, ch) {
    return {
      view: Matrix.arcBallView(-1, this.pitch, this.yaw),
      perspective: Matrix.perspective(this.fovy, 0.001, 10, cw, ch)
    };
  };

  return camera;
});
