define(function(require) {

var Matrix = require('matrix');
var Vector = require('vector');

var vtxShader = ""
+"  uniform mat4 viewIn;"
+"  uniform mat4 perspIn;"
+"  attribute vec3 posIn;"
+"  attribute vec3 normIn;"
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    gl_Position = perspIn * viewIn * vec4(posIn, 1);"
+"    vec3 light = normalize(vec3(1, 1, -1));"
+"    vec3 col = posIn*vec3(0.05,0.1,0.05) + vec3(0.5,0.5,0.5);"
+"    colour = col * dot(normIn, light);"
+"  }";

var frgShader = ""
+"  precision mediump float;"
+"  "
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    gl_FragColor = vec4(colour, 1);"
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
var normAttr = null;
var posBuf = null;
var normBuf = null;
var indexBuffer = null;
var viewUnif = null;
var perspUnif = null;

return function (gl, cw, ch, mesh, pitch, yaw) {
  if (program === null) {
    program = loadProgram(gl, [
      loadShader(gl, vtxShader, gl.VERTEX_SHADER),
      loadShader(gl, frgShader, gl.FRAGMENT_SHADER)
    ]);
    posBuf = gl.createBuffer();
    normBuf = gl.createBuffer();
    posAttr = gl.getAttribLocation(program, "posIn");
    normAttr = gl.getAttribLocation(program, "normIn");
    perspUnif = gl.getUniformLocation(program, "perspIn");
    viewUnif = gl.getUniformLocation(program, "viewIn");
    indexBuffer = createIndexBuffer(gl, mesh.indexes);
  }

  gl.useProgram(program);

  gl.uniformMatrix4fv(viewUnif, false, Matrix.arcBallView(-60, pitch, yaw));
  gl.uniformMatrix4fv(perspUnif, false, Matrix.perspective(1.1, 0.001, 100, cw, ch).m);

  loadVertexAttrib(gl, posBuf, posAttr, mesh.posns, 3);
  loadVertexAttrib(gl, normBuf, normAttr, mesh.norms, 3);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
};

});
