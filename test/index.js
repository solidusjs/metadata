var assert = require('assert');
var fs = require('fs');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata.json');

//////////////
// routing //
////////////

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

//////////////
// mapping //
////////////

lab.experiment('mapping', function(){

  lab.test('maps properties to context data', function( done ){
    var context = require('./fixtures/contexts/dynamic.json');
    addMetadata( context, metadata );
    assert(context.metadata.image.substr(0,3) === 'http');
    done();
  });

  lab.test('safely accesses deeply nested context data', function( done ){
    var context = require('./fixtures/contexts/dynamic2.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    assert(context.metadata.description === false);
    done();
  });

  lab.test('matches metadata to page route', function( done ){ done(); });

});

///////////////
// specials //
/////////////

lab.experiment('special properties', function(){

  lab.test('checks that a image file exists', function( done ){
    var context = require('./fixtures/contexts/path.json');
    assert(context.metadata.image === false);
    done();
  });

  lab.test('checks that an image URL is valid', function( done ){
    var context = require('./fixtures/contexts/root.json');
    assert(context.metadata.image === false);
    done();
  });

  lab.test('passes on a canonical URL', function( done ){
    var context = require('./fixtures/contexts/dynamic.json');
    assert(context.metadata.canonical);
    done();
  });

  lab.test('passes on a canonical URL and populates any parameters', function( done ){
    var context = require('./fixtures/contexts/dynamic.json');
    assert(context.metadata.canonical.split('/').pop() === 'bushwick-artisan');
    done();
  });

  lab.test('passes namespaced RDF properties', function( done ){
    var context = require('./fixtures/contexts/dynamic2.json');
    assert(context.metadata['og:title'] === 'Mumblecore mixtape cart denizen');
    done();
  });

});

///////////
// tags //
/////////

lab.experiment('tags template', function(){

  lab.test('includes open graph titles', function( done ){ done(); });
  lab.test('includes a canonical tag when URL is defined', function( done ){ done(); });
  lab.test('includes image tags when a valid image is defined', function( done ){ done(); });

});