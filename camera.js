define(function(require) {

  var Matrix = require('matrix');
  var Vector = require('vector');

  var camera = {};

  camera.set = function (cw, ch, yaw, pitch) {
    camera.view = Matrix.arcBallView(-1, pitch, yaw),
    camera.perspective = Matrix.perspective(1.1, 0.001, 10, cw, ch)
  };

  return camera;
});
