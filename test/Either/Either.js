'use strict';

var throws = require('assert').throws;

var jsc = require('jsverify');
var R = require('ramda');

var Compose = require('../types/Compose');
var Identity = require('../types/Identity');
var env = require('../types/env');
var errorEq = require('../utils').errorEq;
var S = require('../..').create({checkTypes: true, env: env});


//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
var IdentityArb = function(arb) {
  return arb.smap(Identity, function(i) { return i.value; });
};

//  identityToMaybe :: Identity a -> Maybe a
var identityToMaybe = function(i) {
  return S.Just(i.value);
};

//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
var EitherArb = function(lArb, rArb) {
  return jsc.oneof(LeftArb(lArb), RightArb(rArb));
};

//  LeftArb :: Arbitrary a -> Arbitrary (Either a b)
var LeftArb = function(arb) {
  return arb.smap(S.Left, function(e) { return e.value; }, R.toString);
};

//  RightArb :: Arbitrary a -> Arbitrary (Either b a)
var RightArb = function(arb) {
  return arb.smap(S.Right, function(e) { return e.value; }, R.toString);
};

describe('Either', function() {

  it('throws if called', function() {
    throws(function() { S.Either(); },
           errorEq(Error, 'Cannot instantiate Either'));
  });

  describe('Traversable laws', function() {

    it('satisfies naturality', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.integer, IdentityArb(jsc.string)), function(either) {
        var lhs = identityToMaybe(either.sequence(Identity.of));
        var rhs = either.map(identityToMaybe).sequence(S.Maybe.of);
        return lhs.equals(rhs);
      }));
    });

    it('satisfies identity', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.integer, jsc.string), function(either) {
        var lhs = either.map(Identity).sequence(Identity.of);
        var rhs = Identity.of(either);
        return lhs.equals(rhs);
      }));
    });

    it('satisfies composition', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.string, IdentityArb(EitherArb(jsc.string, jsc.integer))), function(u) {
        var C = Compose(Identity)(S.Either);
        var lhs = u.map(C).sequence(C.of);
        var rhs = C(u.sequence(Identity.of).map(function(x) {
          return x.sequence(S.Either.of);
        }));
        return lhs.equals(rhs);
      }));
    });

  });

});
