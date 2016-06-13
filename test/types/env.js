'use strict';

var $ = require('sanctuary-def');

var S = require('../..');


//  ComposeType :: Type -> Type
var ComposeType = $.UnaryType(
  'sanctuary/Compose',
  function(x) { return x != null && x['@@type'] === 'sanctuary/Compose'; },
  function(compose) { return []; }
);

//  IdentityType :: Type -> Type
var IdentityType = $.UnaryType(
  'sanctuary/Identity',
  function(x) { return x != null && x['@@type'] === 'sanctuary/Identity'; },
  function(identity) { return [identity.value]; }
);

module.exports = S.env.concat([ComposeType, IdentityType]);
