define(function(require) {

var toolpath = require('cnc/toolpath');
var vector = require('vector');

var tests = {};

tests.allPointsAreCoveredByToolpath = function () {
}

return function () {
  for (name in tests) {
    console.log('toolpath '+name);
    tests[name]();
  }
};

});
