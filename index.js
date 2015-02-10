var PARAMS = /\{([^\}]*)\}/g;
var PROPS = /\{\{([^\}]*)\}\}/g;

var crossroads = require('crossroads');
var objectpath = require('object-path');
var humanize = require('string-humanize');
var path = require('path');
var strip = require('strip');
var urlRegex = require('url-regex');

function parse( content, context ){
  if( !content ) return false;

  // Files
  if( content.split('.').pop().match(/gif|jpg|jpeg|png/) ){
    return content
      ? path.join(context.url.origin, content)
      : false;
  }

  // URLs
  if( content && content.slice(0,4) === 'http' ){
    return urlRegex({ exact: true }).test(content)
      ? content
      : false;
  }

  ///////////////////
  // context data //
  /////////////////

  if( content.match(/\./) && (!content.match(/\s/) || content.match(/\{{/)) ){
    // Normalize array selection syntax
    content = content.replace(/\[|\]/g,'.').replace(/\.\./g,'.');

    var props = content.match(PROPS);

    if( props ){
      props.forEach(function( prop ){
        var key = (prop.substr(2, prop.length - 4)).trim();
        var data = objectpath.get(context, key);
        if( data ) content = content.replace(prop, data);
      });
    } else {
      var content = objectpath.get(context, content);
    }

    return content
      ? content
      : false;
  }

  return content;
}

function setCanonical( originPath, context ){
  var params = originPath.match(PARAMS) || [];

  params.forEach(function( parameter ){
    var value = context.parameters[parameter.slice(1,-1)];
    originPath = originPath.replace(parameter, value);
  });

  return path.join(context.url.origin, originPath);
}

module.exports = function( context, metadata ){

  var metadataRouter = crossroads.create();

  // Sort routes to prioritize deeper routes
  var routes = Object.keys(metadata).sort(function( a, b ){
    return b.match(/\//g).length > a.match(/\//g).length
      ? 1
      : -1;
  });

  routes.forEach(function( pattern ){
    if( !metadata[pattern] ) return;

    var content = metadata[pattern];
    var priority;

    // Set priority highest-to-lowest, prioritize static routes
    priority = !pattern.match(PARAMS)
      ? 3
      : 2;

    if( pattern.split('/').pop() === '*' ){
      priority = 1;

      // Adapt glob syntax to crossroads.js named segment constraint
      pattern = pattern.replace('*',':glob*:');
    }

    metadataRouter.addRoute(pattern, function(){
      context.metadata = {};

      context.metadata.title = content.title
        ? parse(content.title, context)
        : humanize(context.url.pathname.split('/')[1]);

      context.metadata.description = content.description
        ? parse(content.description, context)
        : false;

      context.metadata.image = content.image
        ? parse(content.image, context)
        : false;

      context.metadata.canonical = content.canonical
        ? setCanonical(content.canonical, context)
        : false;

      context.metadata['og:type'] = content['og:type'] || 'article';
    }, priority);

    metadataRouter.bypassed.add(function(request){
      context.metadata = false;
    });
  });

  metadataRouter.parse(context.url.path.replace('.json',''), [context]);

  return context;
};
