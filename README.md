# sb8-lib

Text helpers shared by the sb7 applications: `slugify`, `escapeHtml`, `truncate`. A throwaway repository used to exercise Trix V2; nothing here is real work and the whole repository can be deleted at any time.

This package has no surface of its own: no server, no page, no command line. The applications built on it are where it gets exercised. Consumers pin it as a git dependency to a tag (`git+https://github.com/DanielDTech/sb8-lib.git#v0.3.0`), so a release here is a tag they bump.

Run `npm test`.
