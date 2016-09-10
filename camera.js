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
    return this;
  };

  camera.zoom = function (dz) {
    this.distance *= 1 - dz/1000;
    return this;
  };

  camera.distance = function (d) {
    this.distance = d;
    return this;
  };

  camera.toMatrices = function (cw, ch) {
    return {
      view: Matrix.arcBallView(-this.distance, this.pitch, this.yaw),
      perspective: Matrix.perspective(1.1, 1, 10000, cw, ch)
    };
  };

  return camera;
});
