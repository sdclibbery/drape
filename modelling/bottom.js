define(function(require) {

var vector = require('vector');

return function (x, y) {
  return {
    pos: new vector(x,y,0),
    norm: new vector(0,0,1)
  };
}

});
