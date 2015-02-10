var assert = require('assert');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata/pages.json');

lab.experiment('defaults', function(){

  var context = require('./fixtures/contexts/photo.json');
  addMetadata( context, metadata );

  lab.test('a human-friendly URL path when title isn’t defined', function( done ){
    assert(context.metadata.title === 'Photos');
    done();
  });

  // https://developers.facebook.com/docs/reference/opengraph/object-type/website
  lab.test('open graph article type', function( done ){
    assert(context.metadata['og:type'] === 'article');
    done();
  });

  lab.test('falsey optional properties when unavailable', function( done ){
    assert(context.metadata.description === false);
    assert(context.metadata.image === false);
    assert(context.metadata.canonical === false);
    done();
  });

  lab.test('false metadata object if no routes are matched', function( done ){
    var context = require('./fixtures/contexts/events.json');
    addMetadata( context, metadata );
    assert(context.metadata === false);
    done();
  });

});
