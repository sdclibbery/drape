define(function(require) {

  var Matrix = require('matrix');
  var Vector = require('vector');

  var min = Math.min;
  var max = Math.max;

  var camera = {
    pitch: 45,
    yaw: 45,
    distance: 1
  };

  camera.pan = function (dx, dy) {
    this.yaw += dx*0.5;
    this.pitch += dy*0.5;
  };

  camera.zoom = function (dz) {
    this.distance -= dz*0.002;
    this.distance = max(min(this.distance, 2), 0.1);
  };

  camera.toMatrices = function (cw, ch) {
    return {
      view: Matrix.arcBallView(-this.distance, this.pitch, this.yaw),
      perspective: Matrix.perspective(1.1, 0.001, 10, cw, ch)
    };
  };

  return camera;
});
