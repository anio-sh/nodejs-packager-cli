import setupTemporaryProject from "./setupTemporaryProject.mjs"
import bundle from "./bundle.mjs"

export default async function(package_root) {
	const project = setupTemporaryProject(package_root)

	await bundle(project)
}
