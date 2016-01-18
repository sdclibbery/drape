define(function(require) {

var Matrix = require('matrix');
var Vector = require('vector');
var draw = require('draw');

var vtxShader = ""
+"  uniform mat4 viewIn;"
+"  uniform mat4 perspIn;"
+"  attribute vec3 posIn;"
+"  attribute vec3 normIn;"
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    gl_Position = perspIn * viewIn * vec4(posIn, 1);"
+"    vec3 light = vec3(0.3, 0.3, -0.3);"
+"    vec3 ambient = vec3(0.3, 0.3, 0.3);"
+"    vec3 col = posIn*vec3(5,0,5) + vec3(0.5,0.5,0.5);"
+"    colour = col * (ambient + dot(normIn, light));"
+"  }";

var frgShader = ""
+"  precision mediump float;"
+"  "
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    gl_FragColor = vec4(colour, 1);"
+"  }";

var program = null;
var posAttr = null;
var normAttr = null;
var posBuf = null;
var normBuf = null;
var indexBuffer = null;
var viewUnif = null;
var perspUnif = null;

return function (gl, cw, ch, mesh, pitch, yaw) {
  if (program === null) {
    program = draw.loadProgram(gl, [
      draw.loadShader(gl, vtxShader, gl.VERTEX_SHADER),
      draw.loadShader(gl, frgShader, gl.FRAGMENT_SHADER)
    ]);
    posBuf = gl.createBuffer();
    normBuf = gl.createBuffer();
    posAttr = gl.getAttribLocation(program, "posIn");
    normAttr = gl.getAttribLocation(program, "normIn");
    perspUnif = gl.getUniformLocation(program, "perspIn");
    viewUnif = gl.getUniformLocation(program, "viewIn");
    indexBuffer = draw.createIndexBuffer(gl, mesh.indexes);
  }

  gl.useProgram(program);

  gl.uniformMatrix4fv(viewUnif, false, Matrix.arcBallView(-1, pitch, yaw));
  gl.uniformMatrix4fv(perspUnif, false, Matrix.perspective(1.1, 0.001, 10, cw, ch).m);

  draw.loadVertexAttrib(gl, posBuf, posAttr, mesh.posns, 3);
  draw.loadVertexAttrib(gl, normBuf, normAttr, mesh.norms, 3);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
};

});
