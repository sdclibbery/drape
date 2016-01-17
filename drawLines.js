define(function(require) {

var Matrix = require('matrix');
var Vector = require('vector');

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
+"  "
+"  void main() {"
+"    gl_FragColor = vec4(1,0,1,1);"
+"  }";

var loadShader = function(gl, shaderSource, shaderType) {
  var shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.log("*** Error compiling shader :" + gl.getShaderInfoLog(shader) + "\nSource: " + shaderSource);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

var loadProgram = function(gl, shaders, opt_attribs, opt_locations) {
  var program = gl.createProgram();
  for (var ii = 0; ii < shaders.length; ++ii) {
    gl.attachShader(program, shaders[ii]);
  }
  if (opt_attribs) {
    for (var ii = 0; ii < opt_attribs.length; ++ii) {
      gl.bindAttribLocation(
          program,
          opt_locations ? opt_locations[ii] : ii,
          opt_attribs[ii]);
    }
  }
  gl.linkProgram(program);

  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
      console.log("Error in program linking:" + gl.getProgramInfoLog (program));
      gl.deleteProgram(program);
      return null;
  }
  return program;
};

var createIndexBuffer = function (gl, indexes) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);
  return buffer;
};

var loadVertexAttrib = function (gl, buffer, attr, data, stride) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, stride, gl.FLOAT, false, 0, 0);
};

var program = null;
var posAttr = null;
var posBuf = null;
var indexBuffer = null;
var viewUnif = null;
var perspUnif = null;

return function (gl, cw, ch, lines, pitch, yaw) {
  if (program === null) {
    program = loadProgram(gl, [
      loadShader(gl, vtxShader, gl.VERTEX_SHADER),
      loadShader(gl, frgShader, gl.FRAGMENT_SHADER)
    ]);
    posBuf = gl.createBuffer();
    posAttr = gl.getAttribLocation(program, "posIn");
    perspUnif = gl.getUniformLocation(program, "perspIn");
    viewUnif = gl.getUniformLocation(program, "viewIn");
    indexBuffer = createIndexBuffer(gl, lines.indexes);
  }

  gl.useProgram(program);

  gl.uniformMatrix4fv(viewUnif, false, Matrix.arcBallView(-1, pitch, yaw));
  gl.uniformMatrix4fv(perspUnif, false, Matrix.perspective(1.1, 0.001, 10, cw, ch).m);

  loadVertexAttrib(gl, posBuf, posAttr, lines.posns, 3);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.drawElements(gl.LINES, lines.numIndices, gl.UNSIGNED_SHORT, 0);
};
});
