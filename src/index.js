import {readFile, writeFile} from 'fs/promises'
import {convert as _convert_raw} from 'htmlat-raw/src/index.js'
import {convert as _convert_rich} from 'htmlat-rich/src/index.js'

import {JSDOM} from 'jsdom'

const logs = []

function log(...args) {
    logs.push(...args)
    console.log(...args)
}

async function convert(src, dest, raw) {
    const i = await readFile(src, 'utf8')

    const Dom = new JSDOM("<!DOCTYPE html><main></main>")
    const dom = raw
        ? _convert_raw(i, Dom.window.document)
        : _convert_rich(i, Dom.window.document)

    Dom.window.document.querySelector('main').appendChild(dom)

    await writeFile(dest, Dom.serialize())
}

function main() {
    convert(...process.argv.slice(2))
}

if ('production' === process.env.NODE_ENV) main()

export {
    main, convert, logs, log
}
