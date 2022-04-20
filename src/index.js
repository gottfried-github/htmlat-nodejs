import {readFile, writeFile} from 'fs/promises'
import {convert as _convert} from 'htmlat-raw/src/index.js'

import {JSDOM} from 'jsdom'

const logs = []

function log(...args) {
    logs.push(...args)
    console.log(...args)
}

async function convert(src, dest) {
    const i = await readFile(src, 'utf8')

    const Dom = new JSDOM("<!DOCTYPE html><main></main>")
    const dom = _convert(i, Dom.window.document)

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
