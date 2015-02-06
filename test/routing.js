var assert = require('assert');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata.json');

lab.experiment('routing', function(){

  lab.test('metadata for a specific page', function( done ){
    var context = require('./fixtures/contexts/blog.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('metadata for pages with parameters', function( done ){
    var context = require('./fixtures/contexts/post.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('prioritizes static routes', function( done ){
    var context = require('./fixtures/contexts/post3.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Epic Beard Man pop-up Oakland activist');
    done();
  });

  lab.test('metadata for the root page', function( done ){
    var context = require('./fixtures/contexts/index.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Example');
    done();
  });

});
