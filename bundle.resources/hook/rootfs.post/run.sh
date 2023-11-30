#!/bin/bash -euf

saved_pwd="$(pwd)"

if [ -f "apply_default_permissions.sh" ]; then
	printf "Applying default permssions\n"

	cd /

	chmod +x "$saved_pwd/apply_default_permissions.sh"
	"$saved_pwd/apply_default_permissions.sh"

	cd "$saved_pwd"
fi

if [ -f "apply_pmtree_permissions.sh" ]; then
	printf "Applying pmtree permssions\n"

	cd /

	chmod +x "/$saved_pwd/apply_pmtree_permissions.sh"
	"$saved_pwd/apply_pmtree_permissions.sh"

	cd "$saved_pwd"
fi
