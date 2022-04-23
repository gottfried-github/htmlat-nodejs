import path from 'path'
// import URL from 'url'
import {readFile, writeFile} from 'fs/promises'

import {JSDOM} from 'jsdom'
import sanitize from 'sanitize-html'
// import {convert as _convert_raw, TAGS as TAGS_RAW} from 'htmlat-raw/src/index.js'
import {convert as _convert_rich, spanToTextTextNodes, TAGS as TAGS_RICH} from 'htmlat-rich/src/index.js'


const logs = []

function log(...args) {
    logs.push(...args)
    console.log(...args)
}

function sanitizeWrap(wrap) {
    return sanitize(wrap, {
        allowedTags: ['html', 'body', 'head', 'link', 'meta', 'header', 'nav', 'aside', 'main', 'script',],
        allowVulnerableTags: true,
        allowedAttributes: false,
        exclusiveFilter: (frame) => {
            return 'script' === frame.tag && frame.text.trim().length
        },
    })
}

function sanitizeContent(content) {
    return sanitize(content, {
        allowedTags: TAGS_RICH,
        allowedAttributes: {'*': ['data-*'], ...sanitize.defaults.allowedAttributes},
    })
}

// see using paths in script src
function replaceScriptSrc(els) {
    els.forEach(el => {
        if (!el.getAttribute('src')) {
            el.removeAttribute('data-url-to-path')
            return
        }

        const url = new URL(el.getAttribute('src'))
        el.setAttribute('src', `${url.host}${url.pathname}${url.search}${url.hash}`)
        el.removeAttribute('data-url-to-path')
    })
}

function convert(i, wrap) {
    const _wrap = wrap ? sanitizeWrap(wrap) : "<main></main>"

    // console.log("convert, _wrap:", _wrap);

    const Dom = new JSDOM(`<!DOCTYPE html>${_wrap}`)
    if (wrap) {
        if (!Dom.window.document.querySelector('[data-slot]')) throw new Error("wrap content must have an element with data-slot attribute")
        replaceScriptSrc(Dom.window.document.querySelectorAll('[data-url-to-path]'))
    }

    const slotSelector = wrap ? '[data-slot]' : 'main'

    const dom = _convert_rich(i, Dom.window.document, {
            // see 'Sanitizing encoded content doesn't work' in htmlat-rich
            spanTextNodes: true
    })

    Dom.window.document.querySelector(slotSelector).appendChild(dom)

    // console.log("converted, with span text nodes", Dom.window.document.querySelector('main').innerHTML)

    const domStr = sanitizeContent(Dom.window.document.querySelector(slotSelector).innerHTML)

    // console.log("sanitized, with span text nodes", domStr)

    // spanToTextTextNodes works with dom
    Dom.window.document.querySelector(slotSelector).innerHTML = domStr
    spanToTextTextNodes(Dom.window.document.querySelector(slotSelector), Dom.window.document)

    // console.log("with span text nodes converted to Text nodes", Dom.window.document.documentElement.outerHTML)

    return wrap ? Dom.serialize() : Dom.window.document.querySelector('main').innerHTML
}

async function convertFile(src, dest, wrap) {
    const i = await readFile(src, 'utf8')
    const wrapContent = wrap
        ? await readFile(wrap, 'utf8')
        : null

    // console.log("convertFile, wrapContent", wrapContent)

    const o = convert(i, wrapContent)

    await writeFile(dest, o)
}

export {convert, convertFile, logs, log}
