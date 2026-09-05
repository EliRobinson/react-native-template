---
'@repo/config': minor
'@repo/ui': minor
---

Drive all styling from the `@elirobinson/tokens` design system.

`@repo/config/tailwind` is now generated from the design system's stylesheets by
`pnpm tokens:sync` rather than hand-written: 109 colours plus the spacing,
radius, type, weight, line-height, tracking, z-index, duration and container
scales. The mobile platform layer is the baseline, so radii and the small end of
the type ramp are the phone-tuned values.

`@repo/ui`'s Button now names design system tokens (`bg-accent`, `text-fg`)
instead of the old ad-hoc `primary`/`gray` palette. Colours resolve through CSS
variables, so `dark:` variants swap real values.
