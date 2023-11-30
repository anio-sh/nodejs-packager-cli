#!/bin/bash -euf

#
# This script is based on https://www.linuxjournal.com/node/1005818
#

export TMPDIR="$(mktemp -d /tmp/selfextract.XXXXXX)"

ARCHIVE="$(awk '/^__ARCHIVE_BELOW__/ {print NR + 1; exit 0; }' "$0")"

printf "Extracting archive (this might take a while)\n" >&2

tail -n+$ARCHIVE "$0" > "$TMPDIR/bundle.tar.gz"

SAVED_PWD="$(pwd)"
cd "$TMPDIR"

EXPECTED_HASH="$hash$"
ACTUAL_HASH="$(shasum -a 256 "./bundle.tar.gz" | cut -d " " -f1)"

INSTALLER_EXIT_CODE=1

$env_string$

if [ "$ACTUAL_HASH" = "$EXPECTED_HASH" ]; then
	printf "Integrity check passed\n" >&2

	mkdir bundle

	tar -xzf bundle.tar.gz -C bundle

	cd bundle

	printf "Running installer\n" >&2
	printf "%s\n" "-------------------------------------------------------"

	set +e

	# pass all arguments given to this script
	./installer "$@"
	INSTALLER_EXIT_CODE=$?

	set -e

	printf "%s\n" "-------------------------------------------------------"

	printf "\nInstaller returned with exit code %d\n\n" $INSTALLER_EXIT_CODE
else
	printf "Integrity check failed!\n" >&2
fi

cd "$SAVED_PWD"

printf "Cleaning up '%s'\n" "$TMPDIR" >&2

#rm -rf "$TMPDIR"

if [ $INSTALLER_EXIT_CODE -eq 0 ]; then
	printf "\e[1;32m%s\e[0m\n" "==========================================================="
	printf "\e[1;32m%s\e[0m\n" "If you are seeing this message, installation was succesful!"
	printf "\e[1;32m%s\e[0m\n" "==========================================================="
fi

exit $INSTALLER_EXIT_CODE

__ARCHIVE_BELOW__
