var assert = require('assert');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata.json');

lab.experiment('routing', function(){

  lab.test('adds metadata object to context', function( done ){
    var context = require('./fixtures/contexts/path.json');
    addMetadata( context, metadata );
    assert(context.metadata);
    done();
  });

  lab.test('matches metadata to page route', function( done ){
    var context = require('./fixtures/contexts/path.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'BLOG');
    done();
  });

  lab.test('prioritizes static routes', function( done ){
    var context = require('./fixtures/contexts/static.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Epic Beard Man pop-up Oakland activist');
    done();
  });

  lab.test('matches route parameters', function( done ){
    var context = require('./fixtures/contexts/dynamic.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Wes Anderson pop-up Bushwick artisan');
    done();
  });

});
