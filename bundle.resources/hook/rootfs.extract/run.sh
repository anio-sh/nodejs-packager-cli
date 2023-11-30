#!/bin/bash -euf

printf "Extracting rootfs\n"

tar -xzvf rootfs.tar.gz $additional_tar_args$-C /
