---
'@repo/config': patch
'@repo/ui': patch
---

Fix dark mode and the touch target floor on native.

The token variables move from an `@import`ed stylesheet into an `addBase` plugin,
which is the only ordering NativeWind accepts for `.dark:root` on native. Adds a
`minHeight` scale from the design system's `--target` tokens, and `@repo/ui`'s
Button now carries `min-h-target` so it meets the 44px floor.
