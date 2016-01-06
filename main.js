define(function(require) {

//  var play = require('play/play');

var canvas = document.getElementById("canvas");
var ctxGl = canvas.getContext("webgl");
if (!ctxGl) { ctxGl = canvas.getContext("experimental-webgl"); }
if (!ctxGl) { document.getElementById('info').innerHTML = 'WebGL not supported!'; }

ctxGl.clearColor(0, 0, 0, 1);
ctxGl.enable(ctxGl.DEPTH_TEST);
ctxGl.depthFunc(ctxGl.LEQUAL);
ctxGl.clear(ctxGl.COLOR_BUFFER_BIT|ctxGl.DEPTH_BUFFER_BIT);

});
