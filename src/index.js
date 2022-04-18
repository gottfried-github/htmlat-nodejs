import {readFile, writeFile} from 'fs/promises'

import nearley from 'nearley'
import grammar from 'htmlat/src/grammar/grammar.js'
import {convert} from 'htmlat/src/converter/index.js'

import {JSDOM} from 'jsdom'

const logs = []

function log(...args) {
    logs.push(...args)
    console.log(...args)
}

async function parseAndConvert(src, dest) {
    const i = await readFile(src, 'utf8')

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(i)

    log(parser.results[0])

    const Dom = new JSDOM("<!DOCTYPE html><main></main>")
    const dom = convert(parser.results[0], Dom.window.document)

    Dom.window.document.querySelector('main').appendChild(dom)

    await writeFile(dest, Dom.serialize())
}

function main() {
    parseAndConvert(...process.argv.slice(2))
}

export {
    main, parseAndConvert, logs, log
}
