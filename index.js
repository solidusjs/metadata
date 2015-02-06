var PARAMS = /\{([^\}]*)\}/g;

var crossroads = require('crossroads');
var objectpath = require('object-path');
var humanize = require('string-humanize');
var strip = require('strip');
var urlRegex = require('url-regex');

function transform( content, context ){
  if( !content ) return false;

  // Files

  var isFile = (content.slice(0,1) === '/' && fs.existsSync('./assets' + content))
    ? true
    : false;

  if( isFile ) return context.url.origin + content;

  // Context data

  if( !content.match(/\s/) && content.match(/\./) ){
    var data = objectpath.get(context, content);

    content = data
      ? data
      : false;
  }

  // URLs

  if( content && content.slice(0,4) === 'http' ){
    content = urlRegex({ exact: true }).test(content)
      ? content
      : false;
  }

  return content
    ? content
    : false;
}

function setCanonical( path, context ){
  var params = path.match(PARAMS) || [];

  params.forEach(function( parameter ){
    var value = context.parameters[parameter.slice(1,-1)];
    path = path.replace(parameter, value);
  });

  return context.url.origin + path;
}

module.exports = function( context, metadata ){

  var metadataRouter = crossroads.create();

  Object.keys(metadata).forEach(function( pattern ){
    if( metadata[pattern] ){
      var content = metadata[pattern];
      var priority;

      // Prioritize static routes
      if( !pattern.match(PARAMS) ) priority = 1;

      metadataRouter.addRoute(pattern, function(){
        context.metadata = {};
        context.metadata.title = transform(content.title, context);
        context.metadata.description = transform(content.description, context);
        context.metadata.image = transform(content.image, context);
        context.metadata['og:type'] = content['og:type'] || 'article';

        if( !context.metadata.title ) var page = context.url.pathname.split('/')[1];

        if( !context.metadata.title && context.metadata.description ){
          context.metadata.title = context.metadata.description + ' ' + humanize(page);
          context.metadata.description = false;
        } else if( !context.metadata.title ){
          content.metadata.title = humanize(page);
        }

        if( content.canonical ){
          context.metadata.canonical = setCanonical(content.canonical, context);
        }

      }, priority);
    }
  });

  metadataRouter.parse(context.url.path.replace('.json',''), [context]);

  return context;
};
