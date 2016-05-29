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

return function (toolpath) {
  var b = new builder();
  b.comment('DIAMOND, CIR, SQ TEST PROGRAM');
  b.comment('FEB-08-12, 12:05');
  b.comment(' *** UNPROVEN PROGRAM *** ');
  b.comment(' RUN IN VISE ON PARALLELS ');
  b.comment('Z OFFSET: TOP OF MATERIAL WITH ');
  b.comment(' 0.375" MATERIAL ABOVE VISE JAWS ');
  b.comment('X0,Y0,Z0= Center, Center, Top');
  b.comment('STOCK ORIGIN = X0. Y0. Z.01');
  b.comment('MATERIAL TYPE= ALUMINUM inch - 6061');
  b.comment('MATERIAL SIZE= X1.75 Y1.75 Z.5');
  b.comment('TOOL= 1/4 2-FLUTE HSS END MILL)"');
  b.add('G17 G20 G90 G94 G54');
  b.add('G17 G20 G90 G94 G54');
  b.add('G0 Z0.25');
  b.add('X-0.5 Y0.');
  b.add('Z0.1');
  b.add('G01 Z0. F5.');
  b.add('G02 X0. Y0.5 I0.5 J0. F2.5');
  b.add('X0.5 Y0. I0. J-0.5');
  b.add('X0. Y-0.5 I-0.5 J0.');
  b.add('X-0.5 Y0. I0. J0.5');
  b.add('G01 Z0.1 F5.');
  b.add('G00 X0. Y0. Z0.25');
  return b.gcode();
};

});
