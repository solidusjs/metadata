var crossroads = require('crossroads');
var _get = require('perfget')._get;
var humanize = require('string-humanize');
var strip = require('strip');
var url = require('url');

function transform( content, context ){
  if( !content ) return false;

  var isFile = (content.slice(0,1) === '/' && fs.existsSync('./assets' + content))
    ? true
    : false;

  if( isFile ) return context.url.origin + content;

  var isURL = content.slice(0,4) === 'http'
    ? true
    : false;

  if( isURL ){
    var parsedURL = url.parse(content);
    if( parsedURL.href ){ return parsedURL.href } else { isURL = false }
  }

  var isData = (!isFile && !isURL && !content.match(/\s/) && content.match(/\./))
    ? true
    : false;

  if( isData ){
    context = _get(context);
    content = context(content);
    if( content ) content = strip(content);
  }

  return content
    ? content
    : false;
}

function setCanonical( path, context ){
  path.match(/\{([^\}]*)\}/g).forEach(function( parameter ){
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

      });
    }
  });

  metadataRouter.parse(context.url.path.replace('.json',''), [context]);

  return context;
};
