define(function(require) {

var builder = function () {
  this.g = "";
  this.gcode = function () {
    return this.g;
  }
  this.comment = function (msg) {
    this.g += "(" + msg + ")\n";
  }
  this.add = function (line) {
    this.g += line + "\n";
  }
}

var fmt = function (n) {
  return (n*1000).toFixed(2);
}

return function (toolpath) {
  var b = new builder();
  b.comment('GCODE EXPORTED BY DRAPE.JS');
  b.comment(new Date().toString());
  b.comment('GCODE DESIGNED FOR GRBL');
  // Should also comment workpiece size, location and coord systems, tool size and type
  b.add('G17 G21 G90');
  b.add('G00 X0 Y0 Z0');

  b.add('F180');
  toolpath.map(function (node) {
    b.add('G01 X'+fmt(node.pos.x)+' Y'+fmt(node.pos.y)+' Z'+fmt(node.pos.z));
  });

  b.add('G00 X0 Y0 Z0');
  return b.gcode();
};

});
