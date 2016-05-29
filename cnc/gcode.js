define(function(require) {

return function (toolpath) {
  var gcode = "";
  gcode += '(DIAMOND, CIR, SQ TEST PROGRAM)\n';
  gcode += '(FEB-08-12, 12:05) \n';
  gcode += '( *** UNPROVEN PROGRAM *** )\n';
  gcode += '( RUN IN VISE ON PARALLELS )\n';
  gcode += '(Z OFFSET: TOP OF MATERIAL WITH )\n';
  gcode += '( 0.375" MATERIAL ABOVE VISE JAWS )\n';
  gcode += '(X0,Y0,Z0= Center, Center, Top)\n';
  gcode += '(STOCK ORIGIN = X0. Y0. Z.01)\n';
  gcode += '(MATERIAL TYPE= ALUMINUM inch - 6061)\n';
  gcode += '(MATERIAL SIZE= X1.75 Y1.75 Z.5)\n';
  gcode += '(TOOL= 1/4 2-FLUTE HSS END MILL)";\n';
  gcode += 'G17 G20 G90 G94 G54\n';
  gcode += 'G17 G20 G90 G94 G54\n';
  gcode += 'G0 Z0.25\n';
  gcode += 'X-0.5 Y0.\n';
  gcode += 'Z0.1\n';
  gcode += 'G01 Z0. F5.\n';
  gcode += 'G02 X0. Y0.5 I0.5 J0. F2.5\n';
  gcode += 'X0.5 Y0. I0. J-0.5\n';
  gcode += 'X0. Y-0.5 I-0.5 J0.\n';
  gcode += 'X-0.5 Y0. I0. J0.5\n';
  gcode += 'G01 Z0.1 F5.\n';
  gcode += 'G00 X0. Y0. Z0.25\n';
  return gcode;
};

});
