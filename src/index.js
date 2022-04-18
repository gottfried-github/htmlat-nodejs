import {readFile, writeFile} from 'fs/promises'

async function convert(src, dest) {
    const i = await readFile(src, 'utf8')
    console.log(i)
}

convert(...process.argv.slice(2))
