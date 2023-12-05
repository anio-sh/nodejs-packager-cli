# @anio-sh/packager

Make sure `anio_tardp` and `anio_pmtree` are locatable via the `$PATH` environment variable.

Also, make a symbolic link from gnu tar's implementation to `anio_gtar`:

For example, on macOS:

`/usr/local/bin/anio_gtar -> /opt/homebrew/bin/gtar`
