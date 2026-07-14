# Changesets

Run `pnpm changeset` after any change that should be released/noted —
it'll ask which packages changed and whether it's a patch/minor/major.
That gets committed alongside your PR. On merge to `main`, the Release
workflow opens a "Version Packages" PR that bumps versions and updates
CHANGELOGs; merging that PR is what actually tags a release.

This project doesn't publish to npm (it's an app template, not a
library) — changesets here are used purely to keep a clean, versioned
changelog per package as the template evolves.
