import path from "node:path"
import process from "node:process"
import {
	replaceString
} from "@anio-core-sh/js-utils"
import {
	isDirectorySync,
	createDirectorySync,
	writeFileAtomicSync
} from "@anio-core-sh/nodejs-utils"

import {loadResource as loadResourceSync} from "@anio-sh/bundler"

export default function(project) {
	const rootfs_path = path.resolve(project.root, "rootfs")

	if (!isDirectorySync(rootfs_path)) {
		process.stderr.write("No rootfs/ found, skipping\n")

		return
	}

	const hooks = [
		"prereq.rootfs",
		"rootfs.extract",
		"rootfs.post"
	]

	for (const hook of hooks) {
		createDirectorySync(path.join(project.root, "hook", hook))

		writeFileAtomicSync(
			path.join(project.root, "hook", hook, "run.sh"),
			replaceString(
				loadResourceSync(`hook/${hook}/run.sh`), {
					"$additional_tar_args$": ""
				}
			)
		)
	}
}
