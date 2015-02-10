var PARAMS = /\{([^\}]*)\}/g;

var crossroads = require('crossroads');
var objectpath = require('object-path');
var humanize = require('string-humanize');
var path = require('path');
var strip = require('strip');
var urlRegex = require('url-regex');

function transform( content, context ){
  if( !content ) return false;

  // Files
  var isFile = (content.split('.').pop().match(/gif|jpg|jpeg|png/))
    ? true
    : false;

  if( isFile ) return path.join(context.url.origin, content);

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
    if( metadata[pattern] ){
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

      metadataRouter.bypassed.add(function(request){
        context.metadata = false;
      });
    }
  });

  metadataRouter.parse(context.url.path.replace('.json',''), [context]);

  return context;
};
