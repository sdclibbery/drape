define(function(require) {

var gcode = require('cnc/gcode');
var vector = require('vector');

var assertLine = function (actual, line) {
  if (actual.indexOf(line) === -1) {
    console.log('! '+line+' not found in output');
  }
}

var testGCode = function (toolpath, strs) {
  var output = gcode(toolpath);
  strs.map(function (s) {
    assertLine(output, s);
  });
}

var cut = function (x,y,z) {
  return { pos: new vector(x,y,z) };
}

var tests = {};

tests.attribution = function () {
  testGCode([
  ],[
    '(GCODE EXPORTED BY DRAPE.JS)'
  ]);
}

tests.settings = function () {
  testGCode([
  ],[
    'G17','G21','G90'
  ]);
}

tests.oneCut = function () {
  testGCode([
    cut(0,0,0),
    cut(0.01,0.01,0)
  ],[
    'G01 X10.00 Y10.00 Z0.00'
  ]);
}

return function () {
  for (name in tests) {
    console.log('gcode '+name);
    tests[name]();
  }
};

});
