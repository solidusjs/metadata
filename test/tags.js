var assert = require('assert');
var fs = require('fs');
var Handlebars = require('handlebars');
var jsdom = require('jsdom');

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var addMetadata = require('../index');
var metadata = require('./fixtures/metadata/pages.json');

lab.experiment('tags template', function(){

  var context = require('./fixtures/contexts/array.json');
  addMetadata( context, metadata );

  var source = fs.readFileSync('./tags.hbs', 'utf-8');
  var template = Handlebars.compile(source);
  var markup = template(context);

  lab.test('includes open graph titles', function( done ){
    jsdom.env(markup, function( err, window ){
      var title = window.document.querySelector('meta[property="og:title"]').getAttribute('content');
      assert(title === 'Mumblecore mixtape cart denizen');
      done();
    });
  });

  lab.test('includes a canonical tag when URL is defined', function( done ){
    jsdom.env(markup, function( err, window ){
      var canonical = window.document.querySelector('link[rel="canonical"]').getAttribute('href');
      assert(canonical === 'http:/www.example.com/chronicle');
      done();
    });
  });

  lab.test('includes image tags when a valid image is defined', function( done ){
    jsdom.env(markup, function( err, window ){
      var image = window.document.querySelector('link[rel="image_src"]').getAttribute('href');
      var og = window.document.querySelector('meta[property="og:image"]').getAttribute('content');
      assert(image === 'http:/www.example.com/image.gif' && og === 'http:/www.example.com/image.gif');
      done();
    });
  });

});
