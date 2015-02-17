var assert = require('assert');
var fs = require('fs');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');

lab.experiment('error handling', function(){

  lab.test('invalid objects', function( done ){
    var context = require('./fixtures/contexts/photo.json');
    var metadata = fs.readFileSync(__dirname + '/fixtures/metadata/pages.json', 'utf-8');
    assert.throws(function(){ addMetadata(context, metadata) }, Error);
    done();
  });

  lab.test('non-relative routes', function( done ){
    var context = require('./fixtures/contexts/photo.json');
    var metadata = require('./fixtures/metadata/nonrelative.json');
    assert.throws(function(){ addMetadata(context, metadata) }, Error);
    done();
  });

  lab.test('unsupported route syntax', function( done ){
    var context = require('./fixtures/contexts/photo.json');
    var metadata = require('./fixtures/metadata/unsupported.json');
    assert.throws(function(){ addMetadata(context, metadata) }, Error);
    done();
  });

  lab.test('incomplete Solidus context', function( done ){
    var context = require('./fixtures/contexts/incomplete.json');
    var metadata = require('./fixtures/metadata/pages.json');
    assert.throws(function(){ addMetadata(context, metadata) }, Error);
    done();
  });

});
