import path from "node:path"
import os from "node:os"

import readManifestFile from "./readManifestFile.mjs"

import {
	randomIdentifierSync,
	copyDirectorySync
} from "@anio-core-sh/nodejs-utils"

export default function(package_root) {
	const manifest = readManifestFile(package_root)

	const build_id = randomIdentifierSync(8)

	const tmp_path = path.resolve(os.tmpdir(), build_id)
	const pkg_out_path = path.resolve(os.tmpdir(), randomIdentifierSync(8))

	process.stderr.write(
		`Project temporary dir is ${tmp_path}\n`
	)

	copyDirectorySync(package_root, tmp_path)

	return {
		manifest,
		build_id,
		root: tmp_path,
		pkg_out_path
	}
}
