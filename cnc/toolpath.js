define(function(require) {

var vector = require('vector');

return function (surface) {
  return [
    { pos: new vector(0, 0, 0), },
    { pos: new vector(0.1, 0, 0), },
    { pos: new vector(0.1, 0.1, 0), },
    { pos: new vector(0.2, 0.1, 0), },
    { pos: new vector(0.2, 0.2, 0), },
    { pos: new vector(0.3, 0.2, 0), },
    { pos: new vector(0.3, 0.3, 0), },
  ];
};

});
