define(function(require) {

  var Matrix = require('matrix');
  var Vector = require('vector');

  var camera = {
    pitch: 45,
    yaw: 45
  };

  camera.drag = function (dx, dy) {
    this.yaw += dx*0.5;
    this.pitch += dy*0.5;
  };

  camera.toMatrices = function (cw, ch) {
    return {
      view: Matrix.arcBallView(-1, this.pitch, this.yaw),
      perspective: Matrix.perspective(1.1, 0.001, 10, cw, ch)
    };
  };

  return camera;
});
