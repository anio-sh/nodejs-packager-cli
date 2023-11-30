#!/usr/bin/env -S node --experimental-detect-module
import process from "node:process"
import fs from "node:fs/promises"
import main from "./index.mjs"

if (process.argv.length !== 3) {
	process.stderr.write(`Usage: anio_packager <package_root_dir>\n`)
	process.exit(2)
}

try {
	await main(
		await fs.realpath(process.argv[2])
	)
} catch (error) {
	process.stderr.write(`${error.message}\n`)
	process.stderr.write(`\n-- stack trace--\n`)
	process.stderr.write(`${error.stack}\n`)
	process.exit(1)
}
