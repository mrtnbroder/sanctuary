'use strict';

var R = require('ramda');


//  Identity :: a -> Identity a
var Identity = function Identity(x) {
  return {
    '@@type': 'sanctuary/Identity',
    of: Identity,
    map: function(fn) {
      return Identity(fn(x));
    },
    ap: function(y) {
      return Identity(x(y));
    },
    equals: function(other) {
      return R.equals(x, other.value);
    },
    toString: function() { return 'Identity(' + R.toString(x) + ')'; },
    value: x
  };
};

Identity.of = Identity;

module.exports = Identity;
