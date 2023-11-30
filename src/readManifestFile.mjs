import path from "node:path"
import {isFileSync, readFileJSONSync} from "@anio-core-sh/nodejs-utils"

export default function(package_root) {
	let manifest = {}

	const config_path = path.resolve(package_root, "manifest.json")

	if (isFileSync(config_path)) {
		manifest = readFileJSONSync(config_path)
	} else {
		process.stderr.write(`No manifest.json found\n`)
	}

	return manifest
}
