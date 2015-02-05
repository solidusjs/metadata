var assert = require('assert');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata.json');

lab.experiment('mapping', function(){

  lab.test('dynamically maps context data to metadata', function( done ){
    var context = require('./fixtures/contexts/dynamic.json');
    addMetadata( context, metadata );
    assert(context.metadata.image.substr(0,4) === 'http');
    done();
  });

  lab.test('safely accesss deeply nested context data', function( done ){
    var context = require('./fixtures/contexts/dynamic2.json');
    addMetadata( context, metadata );
    assert(context.metadata.title === 'Mumblecore mixtape cart denizen');
    assert(context.metadata.description === false);
    done();
  });

  lab.test('ensures image files exist', function( done ){ done(); });
  lab.test('ensures crawlers can access image files', function( done ){ done(); });

});
