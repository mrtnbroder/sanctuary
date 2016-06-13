'use strict';

var runCompositionTests = require('./utils').runCompositionTests;
var S = require('..');


describe('compose', function() {

  runCompositionTests(S.compose);

});
