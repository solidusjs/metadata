# [solidus](http://github.com/solidusjs)-metadata

[RDFa][rdfa], [Schema.org][schema], [Open Graph][open], and good ol’ [meta tags][meta]. The semantic web is really an actual thing! But getting the right tags and code in place takes time. That’s time you _should_ be spending optimizing the content as best as you can. The plethora of API data available in a typical Solidus site offers plenty to work with. But passing that content into the right tags remains tricky, until now.

```js
var metadata = require('metadata.json');
var addMetadata = require('solidus-metadata');

addMetadata( context, metadata );
```

### `metadata`

This module adds a metadata object to your context that’s most useful in a page’s layout. Content can be defined for any of the following special properties:

##### `title`

Generally prone to truncation, so it really [shouldn’t be longer than 55 characters][seomoz-title].

##### `description`

A blob of text, that should prioritize what really needs to be said in the [first ~155 characters][seomoz-description].

##### `image`

A thumbnail, for use in `og:image`, `twitter:image`, etc.

##### `ns:*`

[Open Graph tags][open], [Twitter Cards][twitter], or any other namespaced RDF properties.

##### `canonical`

A path or URL pointing to the [canonical version][canonical] of the current page.


Mapping
-------

Simple routing patterns are used to match the routes of your pages and map the desired data to their context when rendered. Any variables should be specified in `{curly}` syntax, just like the filesystem:

```json
{
  "/news": {
    "title": "resources.post.title",
    "description": "resources.post.excerpt"
  },
  "/news/{id}/{slug}": {
    "title": "resources.post.title",
    "description": "resources.post.excerpt",
    "image": "resources.post.featured_image.source",
    "og:type": "article",
    "canonical": "/news/{id}/{slug}"
  }
}

```

YAML is recommended for sites bigger than a couple of pages. It’s a tool that helps direct focus on the content, and avoid syntax errors through a more lenient syntax than JSON. [js-yaml][js-yaml] is a good parsing module.

```yaml
/news/{id}/{slug}:

  title: resources.post.title
  description: resources.post.excerpt
  image: resources.post.featured_image.source
  og:type: article
  canonical: /news/{id}/{slug}
```

### Fallbacks / Defaults

It’s a good idea to add at least one fallback route to provide some default metadata when no other routes are matched. Just add a glob star at the end of your route:

```yaml
/*:

  title: The infinite is possible.
  description: You can do anything, anything at all.
```

Whenever possible provide a [descriptive and concise][title] for your pages to avoid filling indexes with repetitive, unhelpful content. Fallbacks should not be relied upon as they will do just that if not used sparingly.


Content
-------

All content is defined as strings. Aside from simple text, certain patterns trigger some additional magic when matched:

 - **Files** are strings that look like relative paths. To make sure we’ll check to see if the file actually exists in the filesystem.

 - **URLs** are strings beginning with `http` that are valid URLs. To make sure we’ll [parse the URL][url] and return the value of `href`.
 
 - **Data** is a string without any spaces that can select anything in your context with dot notation. No worries, deeply nested properties will be safely accessed. Array indexes can also be selected with dots or brackets. Add metadata to your context after preprocessing and of course you’ll have access to that version of the context as well.

 - **Canonical Path Variables** can be specified in the same `{curly}` syntax as page routes, and will be replaced with any like-named variables from the matched route.

----
**[MIT](LICENSE) LICENSE** <br>
copyright &copy; 2014 sparkart group, inc.


[rdfa]: http://rdfa.info
[schema]: http://schema.org
[open]: http://ogp.me
[meta]: http://www.w3.org/TR/html5/document-metadata.html#the-meta-element
[twitter]: https://dev.twitter.com/cards

[type]: http://ogp.me/#types
[canonical]: https://support.google.com/webmasters/answer/139066?hl=en
[url]: http://nodejs.org/api/url.html

[seomoz-title]: http://moz.com/learn/seo/title-tag
[seomoz-description]: http://moz.com/learn/seo/meta-description

[js-yaml]: https://www.npmjs.com/package/js-yaml