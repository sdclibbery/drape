// Run 'node test' from the root directory to run these tests

//---------
// Patch to enable normal web require modules to load from node, including using their normal require paths
var mod = null;
var webRequire = function (path) {
  require('../'+path);
  return mod;
};
define = function(f) {
  mod = f(webRequire);
};
// End of require patch
//---------

var bottom = webRequire('modelling/bottom');

console.log('hello '+bottom(5,6).pos.y);