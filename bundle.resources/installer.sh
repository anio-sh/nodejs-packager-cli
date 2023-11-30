#!/bin/bash -euf

set -o pipefail

function anio_run_hook() {
	local hook_name="$1"

	if [ ! -f "hook/$hook_name/run.sh" ]; then
		printf "\nno '%s' hook in package, skipping\n" "$hook_name" >&2

		return
	fi

	local saved_pwd="$(pwd)"

	cd "hook/$hook_name"

	chmod +x ./run.sh

	printf "\n++ Running hook '%s'\n" "$hook_name"

	set +e

	./run.sh 2>&1 | while IFS= read -r line; do
		printf "[%-16s]    %s\n" "$hook_name" "$line"
	done

	local hook_exit_status="$?"

	set -e

	cd "$saved_pwd"

	printf "hook '%s' exited with status code %d\n" "$hook_name" "$hook_exit_status" >&2

	if [ $hook_exit_status -ne 0 ]; then
		printf "terminating because of non-zero exit code\n" >&2

		exit $hook_exit_status
	fi
}

function anio_run_prereq() {
	anio_run_hook "prereq"

	# this hook verifies integrity of rootfs.tar.gz
	# this is ran here before any changes are made to the system
	anio_run_hook "prereq.rootfs"
}

anio_run_prereq
anio_run_hook "pre"

anio_run_hook "rootfs.extract"
anio_run_hook "rootfs.post"

anio_run_hook "install"

anio_run_hook "post"
