define(function(require) {

var vtxShader = ""
+"  uniform mat4 perspIn;"
+"  attribute vec3 posIn;"
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    gl_Position = perspIn * vec4(posIn, 1);"
+"    colour = posIn/100.0 + vec3(0.5, 0.5, 0.5);"
+"  }";

var frgShader = ""
+"  precision mediump float;"
+"  "
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    gl_FragColor = vec4(colour, 1);"
+"  }";

var perspectiveMatrix = function (fovy, near, far, cw, ch) {
    var aspect = cw / ch;
    var f = 1.0 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);
    var out = new Float32Array(16);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

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
var perspUnif = null;

return function (gl, cw, ch, mesh) {
  if (program === null) {
    program = loadProgram(gl, [
      loadShader(gl, vtxShader, gl.VERTEX_SHADER),
      loadShader(gl, frgShader, gl.FRAGMENT_SHADER)
    ]);
    posBuf = gl.createBuffer();
    posAttr = gl.getAttribLocation(program, "posIn");
    perspUnif = gl.getUniformLocation(program, "perspIn");
    indexBuffer = createIndexBuffer(gl, mesh.indexes);
  }

  gl.useProgram(program);

  gl.uniformMatrix4fv(perspUnif, false, perspectiveMatrix(1.7, 0.001, 100, cw, ch));

  loadVertexAttrib(gl, posBuf, posAttr, mesh.posns, 3);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  gl.drawElements(gl.TRIANGLES, mesh.numIndices, gl.UNSIGNED_SHORT, 0);
};

});
