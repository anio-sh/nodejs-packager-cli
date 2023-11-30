import path from "node:path"
import fs from "node:fs/promises"

import {execFileSync} from "node:child_process"
import {loadResource as loadResourceSync} from "@anio-sh/bundler"

import {
	writeFileAtomicSync,
	removeDirectorySync,
	removeFileSync
} from "@anio-core-sh/nodejs-utils"

import {
	escapeshellarg,
	replaceString
} from "@anio-core-sh/js-utils"

import createRootFSHooks from "./createRootFSHooks.mjs"
import outputSelfExtractExecutable from "./outputSelfExtractExecutable.mjs"

export default async function(project) {
	let bundle_template = loadResourceSync("bundle_template_script.sh")

	const rootfs_path = path.resolve(project.root, "rootfs")

	let rootfs_owner = project.manifest.rootfs?.defaults?.owner ?? "nobody:nogroup"
	let rootfs_dmode = project.manifest.rootfs?.defaults?.dir_mode ?? "0"
	let rootfs_fmode = project.manifest.rootfs?.defaults?.file_mode ?? "0"
	let env          = project.manifest?.env ?? {}

	bundle_template = replaceString(bundle_template, {
		"$default_owner$": escapeshellarg(rootfs_owner),
		"$default_dmode$": escapeshellarg(rootfs_dmode),
		"$default_fmode$": escapeshellarg(rootfs_fmode)
	})

	writeFileAtomicSync(
		path.resolve(project.root, "_bundle.sh"),
		bundle_template
	)

	writeFileAtomicSync(
		path.resolve(project.root, "installer"),
		loadResourceSync("installer.sh")
	)

	await fs.chmod(path.resolve(project.root, "_bundle.sh"), 0o777)
	await fs.chmod(path.resolve(project.root, "installer"), 0o777)

	await createRootFSHooks(project)

	const result = execFileSync(
		path.join(project.root, "_bundle.sh"), [
			project.pkg_out_path
		], {
			cwd: project.root,
			stdio: "inherit"
		}
	)

	await outputSelfExtractExecutable(project, env)

	removeDirectorySync(project.root)

	removeFileSync(project.pkg_out_path)
}
