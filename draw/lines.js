define(function(require) {

var Matrix = require('matrix');
var Vector = require('vector');
var draw = require('draw/draw');

var vtxShader = ""
+"  uniform mat4 viewIn;"
+"  uniform mat4 perspIn;"
+"  attribute vec3 posIn;"
+"  attribute vec3 normIn;"
+"  "
+"  void main() {"
+"    gl_Position = perspIn * viewIn * vec4(posIn, 1);"
+"  }";

var frgShader = ""
+"  precision mediump float;"
+"  uniform vec4 colIn;"
+"  "
+"  void main() {"
+"    gl_FragColor = colIn;"
+"  }";

return function (gl, lines, r,g,b) {
  var program = null;
  var posAttr = null;
  var posBuf = null;
  var indexBuffer = null;
  var viewUnif = null;
  var perspUnif = null;
  var colUnif = null;

  program = draw.loadProgram(gl, [
    draw.loadShader(gl, vtxShader, gl.VERTEX_SHADER),
    draw.loadShader(gl, frgShader, gl.FRAGMENT_SHADER)
  ]);
  posBuf = gl.createBuffer();
  posAttr = gl.getAttribLocation(program, "posIn");
  perspUnif = gl.getUniformLocation(program, "perspIn");
  viewUnif = gl.getUniformLocation(program, "viewIn");
  colUnif = gl.getUniformLocation(program, "colIn");
  indexBuffer = draw.createIndexBuffer(gl, lines.indexes);

  return function (gl, view, perspective) {
    gl.useProgram(program);

    gl.uniformMatrix4fv(viewUnif, false, view);
    gl.uniformMatrix4fv(perspUnif, false, perspective.m);
    gl.uniform4f(colUnif, r,g,b,1);

    draw.loadVertexAttrib(gl, posBuf, posAttr, lines.posns, 3);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.LINES, lines.numIndices, gl.UNSIGNED_SHORT, 0);
  };
}

});
