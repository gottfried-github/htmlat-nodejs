#! /usr/bin/env node

import {convert} from './lib.js'

function main() {
    const io = process.argv.slice(2, 4), rest = process.argv.slice(4)
    const raw = rest.includes('--raw'), wrap = rest.includes('--wrap')

    convert(...io, {raw, wrap})
}

main()

export {
    main
}
