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
webRequire('modelling/path/test')();
webRequire('modelling/primitives-test')();
webRequire('cnc/gcode-test')();
webRequire('cnc/toolpath-test')();
webRequire('cnc/analysis/search-test')();
