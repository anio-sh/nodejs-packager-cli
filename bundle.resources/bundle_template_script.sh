#!/bin/bash -euf

set -o pipefail

if [ -d "rootfs" ]; then
	cd rootfs

	anio_gtar           \
		--owner=65534   \
		--group=65534   \
		--numeric-owner \
		--mode=0        \
		-czf ../hook/rootfs.extract/rootfs.tar.gz .

	cd ..

	anio_gtar -tzf hook/rootfs.extract/rootfs.tar.gz | anio_tardp $default_owner$ $default_dmode$ $default_fmode$ > hook/rootfs.post/apply_default_permissions.sh

	shasum -a 256 hook/rootfs.extract/rootfs.tar.gz | cut -d " " -f 1 > hook/rootfs.extract/rootfs.sha256

	rm -r rootfs
fi

if [ -d "pmtree" ]; then
	anio_pmtree pmtree/rootfs.sh > hook/rootfs.post/apply_pmtree_permissions.sh

	rm -r pmtree
fi

rm -f _bundle.sh

anio_gtar -czf "$1" .
