#!/bin/bash -euf

cd ../rootfs.extract/

if [ ! -f "rootfs.tar.gz" ]; then
	printf "Nothing to do, no rootfs.tar.gz found\n"

	exit 0
fi

actual_hash="$(shasum -a 256 rootfs.tar.gz | cut -d ' ' -f 1)"
expected_hash="$(cat rootfs.sha256)"

printf "Actual Hash   = %s\n" "$actual_hash"
printf "Expected Hash = %s\n" "$expected_hash"

if [ "$actual_hash" != "$expected_hash" ]; then
	printf "rootfs.tar.gz integrity check failed!\n" >&2

	exit 1
fi
