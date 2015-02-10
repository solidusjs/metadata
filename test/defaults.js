var assert = require('assert');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata.json');

lab.experiment('defaults', function(){

  lab.test('metadata object to false if no routes are matched', function( done ){
    var context = require('./fixtures/contexts/events.json');
    addMetadata( context, metadata );
    assert(context.metadata === false);
    done();
  });

});
