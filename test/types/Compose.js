'use strict';

var R = require('ramda');


//  Compose :: (Apply f, Apply g) => { of :: b -> f b } -> { of :: c -> g c } -> f (g a) -> Compose f g a
var Compose = function(F) {
  return function(G) {
    var _Compose = function _Compose(x) {
      return {
        '@@type': 'sanctuary/Compose',
        constructor: _Compose,
        map: function(f) {
          return _Compose(R.map(R.map(f), x));
        },
        ap: function(y) {
          return _Compose(R.ap(R.map(R.ap, x), y.value));
        },
        equals: function(other) {
          return R.equals(x, other.value);
        },
        toString: function() {
          return 'Compose(' + R.toString(F) + ')' +
                        '(' + R.toString(G) + ')' +
                        '(' + R.toString(x) + ')';
        },
        value: x
      };
    };
    _Compose.of = function(x) { return _Compose(F.of(G.of(x))); };
    return _Compose;
  };
};

module.exports = Compose;
