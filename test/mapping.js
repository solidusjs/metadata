var assert = require('assert');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata/pages.json');

lab.experiment('mapping', function(){

  lab.test('context data', function( done ){
    var context = require('./fixtures/contexts/post-with-resources.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('context data variables within a string', function( done ){
    var metadata = require('./fixtures/metadata/interpolation.json');
    var context = require('./fixtures/contexts/photo.json');
    addMetadata( context, metadata );
    assert(context.metadata.description === 'Photo taken 3-15-2015 of someone smiling');
    done();
  });

  lab.test('deeply nested context data', function( done ){
    var context = require('./fixtures/contexts/post-with-resources.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    assert(context.metadata.description === false);
    done();
  });

  lab.test('context data within an array', function( done ){
    var context = require('./fixtures/contexts/array.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('context data within an array (JS syntax)', function( done ){
    var metadata = require('./fixtures/metadata/array-syntax-js.json');
    var context = require('./fixtures/contexts/array.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('context data within an array (Handlebars syntax)', function( done ){
    var metadata = require('./fixtures/metadata/array-syntax-hbs.json');
    var context = require('./fixtures/contexts/array.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    done();
  });

  lab.test('HTML strings', function( done ){
    var metadata = require('./fixtures/metadata/html-strings.json');
    var context = require('./fixtures/contexts/post-with-resources.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'The original: DIY photo booth, single-origin coffee master');
    done();
  });

  lab.test('image URLs', function( done ){
    var context = require('./fixtures/contexts/post-with-resources.json');
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
