import {readFile, writeFile} from 'fs/promises'
import {JSDOM} from 'jsdom'
import sanitize from 'sanitize-html'
import {convert as _convert_raw, TAGS as TAGS_RAW} from 'htmlat-raw/src/index.js'
import {convert as _convert_rich, spanToTextTextNodes, TAGS as TAGS_RICH} from 'htmlat-rich/src/index.js'


const logs = []

function log(...args) {
    logs.push(...args)
    console.log(...args)
}

async function convert(src, dest, options) {
    const i = await readFile(src, 'utf8')

    const Dom = new JSDOM("<!DOCTYPE html><main></main>")
    const dom = options.raw
        ? _convert_raw(i, Dom.window.document)
        : _convert_rich(i, Dom.window.document, {
            // see 'Sanitizing encoded content doesn't work' in htmlat-rich
            spanTextNodes: true
        })

    Dom.window.document.querySelector('main').appendChild(dom)

    // console.log("converted, with span text nodes", Dom.window.document.querySelector('main').innerHTML)

    const domStr = sanitize(Dom.window.document.querySelector('main').innerHTML, {
        allowedTags: options.raw ? TAGS_RAW : TAGS_RICH,
        allowedAttributes: {'*': ['data-*'], ...sanitize.defaults.allowedAttributes},
    })

    // console.log("sanitized, with span text nodes", domStr)

    // spanToTextTextNodes works with dom
    Dom.window.document.querySelector('main').innerHTML = domStr
    spanToTextTextNodes(Dom.window.document.querySelector('main'), Dom.window.document)

    // console.log("with span text nodes converted to Text nodes", Dom.window.document.documentElement.outerHTML)

    await writeFile(dest, options.wrap ? Dom.serialize() : Dom.window.document.querySelector('main').innerHTML)
}

export {convert, logs, log}
