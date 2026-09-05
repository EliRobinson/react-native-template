# @repo/ui

## 1.0.0

### Major Changes

- 942d63b: Modernize the whole toolchain: Expo 57 (React 19.2, React Native 0.86), Prisma 7
  with a driver adapter, Zod 4, Fastify 5, TypeScript 6, ESLint 10, and pnpm 11.

  Breaking for consumers of these packages:

  - `@repo/ui` now requires React >= 19 and React Native >= 0.86.
  - `@repo/api-contracts` emits Zod 4 schemas; `z.string().uuid()`/`.email()`/`.url()`
    are now `z.uuid()`/`z.email()`/`z.url()`.
  - `@repo/config`'s ESLint preset targets ESLint 10 flat config.

### Minor Changes

- 942d63b: Drive all styling from the `@elirobinson/tokens` design system.

  `@repo/config/tailwind` is now generated from the design system's stylesheets by
  `pnpm tokens:sync` rather than hand-written: 109 colours plus the spacing,
  radius, type, weight, line-height, tracking, z-index, duration and container
  scales. The mobile platform layer is the baseline, so radii and the small end of
  the type ramp are the phone-tuned values.

  `@repo/ui`'s Button now names design system tokens (`bg-accent`, `text-fg`)
  instead of the old ad-hoc `primary`/`gray` palette. Colours resolve through CSS
  variables, so `dark:` variants swap real values.

### Patch Changes

- 942d63b: Fix dark mode and the touch target floor on native.

  The token variables move from an `@import`ed stylesheet into an `addBase` plugin,
  which is the only ordering NativeWind accepts for `.dark:root` on native. Adds a
  `minHeight` scale from the design system's `--target` tokens, and `@repo/ui`'s
  Button now carries `min-h-target` so it meets the 44px floor.
