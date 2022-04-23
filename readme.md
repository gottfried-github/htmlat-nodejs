# Nodejs `htmlat` to `html` converter
* Sanitizes the output html with [`sanitize-html`](https://www.npmjs.com/package/sanitize-html). See ['XSS prevention' in `htmlat-rich`](https://github.com/gottfried-github/htmlat-rich#xss-prevention)
* uses [`JSDOM`](https://www.npmjs.com/package/jsdom)

## Install
`npm i --save htmlat-nodejs`

## Use
```javascript
import {convert} from 'htmlat-nodejs'
const htmlStr = convert('(article){{(p){{my blog content here}}}}', {wrap: true})

import {convertFile} from 'htmlat-nodejs'
convertFile('src/my-blogpost.semtext', 'dist/my-blogpost.html', {wrap: true})
```

### Wrapping content in a document
You can provide custom html to wrap your content with. E.g., with
```html
<html>
    <head>
        <link rel="stylesheet" href="css/index.css">
    </head>
    <body>
        <main data-slot></main>
    </body>
</html>
```
your content will be placed inside the `main` element.

To provide the wrap:
```javascript
convert('(p){{my content}}', '<html><head></head><body></body></html>')
convertFile('src/my-blogpost.semtext', 'dist/my-blogpost.html', 'src/custom-wrap.html')
```

#### Allowed tags
The following tags are allowed in a wrap: `html`, `body`, `head`, `link`, `meta`, `header`, `nav`, `aside`, `main`, `script`.

#### `data-slot`
The content will be placed inside the element, which has the `data-slot` attribute. The wrap must have an element with this attribute.

#### `script`
The `script` tags can only be used to import scripts (e.g., `<script src="index.js"></script>`). Any `script` that has content will be removed.

### cli
[`htmlat-cli`](#) provides a nice cli for this module.

### using paths in `script` `src`
`sanitize-html` won't allow simple paths (e.g., `scripts/index.js`) in the `src` attribute; it only allows urls.
To be able to use such paths, you have to specify the path as part of a url, e.g. `https://scripts/index.js` and set the `data-url-to-path` attribute.

E.g., `<script src="https://scripts/index.js" data-url-to-path></script>`.
