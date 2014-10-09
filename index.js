var crossroads = require('crossroads');
var _get = require('perfget')._get;
var strip = require('strip');

var metadataRouter = crossroads.create();
crossroads.ignoreState = true;

function process( content, context ){
  if( !content ) return false;

  var isFile = (content.slice(0,1) === '/' && fs.existsSync('./assets' + content))
    ? true
    : false;

  if( isFile ) return context.url.origin + content;

  var isData = (!isFile && !content.match(/\s/) && content.match(/\./))
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

  Object.keys(metadata).forEach(function( pattern ){
    if( metadata[pattern] ){
      var content = metadata[pattern];

      metadataRouter.addRoute(pattern, function(){
        context.metadata = {};
        context.metadata.title = process(content.title, context);
        context.metadata.description = process(content.description, context);
        context.metadata.image = process(content.image, context);
        context.metadata['og:type'] = content['og:type'] || 'article';

        if( content.canonical ){
          context.metadata.canonical = setCanonical(content.canonical, context);
        }

      });
    }
  });

  metadataRouter.parse(context.url.path.replace('.json',''), [context]);

  return context;
};
