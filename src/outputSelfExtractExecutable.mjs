import {execFileSync} from "node:child_process"
import {replaceString, escapeshellarg} from "@anio-core-sh/js-utils"
import {loadResource as loadResourceSync} from "@anio-sh/bundler"

export default function(project, env) {
	const shasum = (execFileSync(
		"shasum", [
			"-a", "256",
			project.pkg_out_path
		]
	)).toString().slice(0, 64)

	let self_extract_script = loadResourceSync("self_extract.sh")
	let env_string = ""

	for (const env_key in env) {
		env_string += `export ${env_key}=${escapeshellarg(env[env_key])};\n`
	}

	process.stdout.write(
		replaceString(self_extract_script, {
			"$hash$": shasum,
			"$env_string$": env_string
		})
	)

	execFileSync(
		"cat", [
			project.pkg_out_path
		], {
			stdio: "inherit"
		}
	)
}
