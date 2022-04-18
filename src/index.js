import {readFile, writeFile} from 'fs/promises'
import nearley from 'nearley'
import grammar from 'htmlat/src/grammar/grammar.js'

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const logs = []

function log(...args) {
    logs.push(...args)
    console.log(...args)
}

async function convert(src, dest) {
    const i = await readFile(src, 'utf8')
    parser.feed(i)

    log(parser.results[0])

    await writeFile(dest, JSON.stringify(parser.results[0], null, 2))
}

function main() {
    convert(...process.argv.slice(2))
}

export {
    main, convert, logs, log
}
