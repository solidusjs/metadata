var assert = require('assert');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata.json');

lab.experiment('mapping', function(){

  lab.test('context data', function( done ){
    var context = require('./fixtures/contexts/post.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('deeply nested context data', function( done ){
    var context = require('./fixtures/contexts/post.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    assert(context.metadata.description === false);
    done();
  });

  lab.test('context data within an array', function( done ){
    var context = require('./fixtures/contexts/blog.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('image URLs', function( done ){
    var context = require('./fixtures/contexts/post.json');
    addMetadata( context, metadata );
    assert(context.metadata.image.substr(0,4) === 'http');
    done();
  });

  lab.test('bad image URLs', function( done ){
    var context = require('./fixtures/contexts/index.json');
    addMetadata( context, metadata );
    assert(context.metadata.image === false);
    done();
  });

  lab.test('image files', function( done ){ done(); });
  lab.test('missing image files', function( done ){ done(); });

});
