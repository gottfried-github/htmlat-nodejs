# Convert `semtext` format into `html` with `htmlat-rich`, in `nodejs`
* Sanitizes the output html with [`sanitize-html`](https://www.npmjs.com/package/sanitize-html). See `'XSS prevention'` in `htmlat-rich`
* uses [`JSDOM`](https://www.npmjs.com/package/jsdom)

## Install
`npm i --save htmlat-nodejs`

## Use
```javascript
import {convert} from 'htmlat-nodejs'
convert('src/my-blogpost.semtext', 'dist/my-blogpost.html', {wrap: true})
```

### `wrap` option
Whether to wrap the resulting html in an html document (i.e., `<!DOCTYPE html><html><body>your content here</body></html>`).

## cli
[`htmlat-cli`]() provides a nice cli for this module.
