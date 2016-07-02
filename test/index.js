// Run 'node test' from the root directory to run these tests

//---------
// Patch to enable normal web require modules to load from node, including using their normal require paths
var thisPath = null;
var mods = {};
var webRequire = function (path) {
  thisPath = path;
  require('../'+path);
  thisPath = null;
  return mods[path];
};
define = function(f) {
  if (thisPath === null) { alert('Require Error!'); }
  mods[thisPath] = f(webRequire);
};
// End of require patch
//---------

// Test modules
webRequire('test/paths')();
webRequire('test/primitives')();
webRequire('test/gcode')();
webRequire('test/toolpath')();
