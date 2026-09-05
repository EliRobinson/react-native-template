# Agent Instructions

pnpm + Turborepo monorepo. One Expo Router app (`apps/mobile-web`) ships iOS,
Android and web from a single codebase; `apps/api` is Fastify + tRPC; shared code
lives in `packages/*` (`ui`, `api-contracts`, `utils`, `config`).

> Edit this file only. `CLAUDE.md` is a symlink to `AGENTS.md`.

**Package manager:** pnpm (`pnpm@11.25.0`) · **Node:** 24 (`.nvmrc`)

**Common commands:** `pnpm dev` · `pnpm lint` · `pnpm typecheck` · `pnpm test` ·
`pnpm build` · `pnpm tokens:sync`

---

## Tech stack

| Layer            | Choice                                                      |
| ---------------- | ----------------------------------------------------------- |
| Mobile + web app | Expo SDK 57, Expo Router, React Native 0.86, React 19.2     |
| Styling          | NativeWind 4 on Tailwind 3, themed by `@elirobinson/tokens` |
| API              | Fastify 5 + tRPC 11                                         |
| Database         | Prisma 7 with the `@prisma/adapter-pg` driver adapter       |
| Schemas          | Zod 4, shared from `packages/api-contracts`                 |
| Data fetching    | TanStack Query 5 via `@trpc/react-query`                    |
| Language         | TypeScript 6 (strict)                                       |
| Unit tests       | Jest 29 (`jest-expo` for anything that renders)             |
| Web E2E          | Playwright · **Mobile E2E** Maestro                         |
| Lint             | ESLint 10 flat config, shared from `packages/config`        |
| Releases         | Changesets, Conventional Commits via commitlint + Husky     |

---

## Rules

- Use `pnpm`, not `npm` or `yarn` — the repo pins `packageManager`.
- Shared request/response schemas belong in `packages/api-contracts` (Zod), not
  duplicated client-side. Add a router procedure in `apps/api/src/router.ts`
  alongside any new schema.
- The client only type-imports `AppRouter` from `apps/api` — never import server
  runtime code (Prisma, handlers) from `apps/mobile-web`, or Metro will pull the
  server bundle into the app.
- Run `pnpm lint`, `pnpm typecheck` and `pnpm test` before considering a change
  done. For anything touching the app shell, styling or Metro config, also run
  `pnpm build` — the gates do not exercise the bundler.
- Follow Conventional Commits — e.g. `fix(api): ...`, `feat(ui): ...`.
- Add a changeset (`pnpm changeset`) for any user-facing or package-level change.
- Styling is NativeWind — keep styles in `className`, not `StyleSheet`, unless a
  case genuinely needs it.

---

## Styling: design system tokens

Colour, spacing, radii, type and motion come from **`@elirobinson/tokens`**
(the Miltinson design system, upstream: https://github.com/EliRobinson/design-system).
Nothing in this repo restates what a token is worth.

**Do not hardcode a colour, radius, font size or duration.** Use the utility that
names the token — `bg-accent`, `text-fg-2`, `rounded-md`, `p-4`. If you need a
value that has no token, that is a design system gap worth raising upstream, not
a hex code worth inlining.

**Discover, don't document.** Never trust a token list pasted into prose — it is
wrong as of the next release. Read the generated file instead:

```bash
node -e "console.log(Object.keys(require('./packages/config/tailwind/tokens.generated.js').colors).join('\n'))"
```

### How the bridge works

React Native cannot parse `oklch()` or resolve `var()` chains, and a Tailwind
config is synchronous CommonJS while the design system's parser is ESM. So the
tokens are converted ahead of time:

```
@elirobinson/tokens (palettes.css + tokens.css + mobile.css)
  -> packages/config/tailwind/sync-tokens.mjs
       -> tokens.generated.js   (Tailwind theme: scales, and colours as var names)
       -> tokens.generated.css  (:root and .dark blocks with the real hex values)
```

- **Run `pnpm tokens:sync` after bumping `@elirobinson/tokens`.** Nothing else
  needs hand-editing; both generated files carry a do-not-edit banner.
- The **mobile platform layer is the baseline**, not an override. `mobile.css`
  recuts radii, the small end of the type ramp, gutters and container widths for
  a device at arm's length — so `rounded-md` is 12px here, not the desktop 6px.
  It changes no colour by design, so every contrast ratio the system asserts
  still holds.
- Colours resolve through `var(--ds-*)` rather than literal hex, which is what
  makes one class (`bg-bg`) pick up the dark value automatically. `darkMode` is
  `'class'` because Expo Router sets the colour scheme programmatically, which
  NativeWind's default media-query dark mode cannot follow.
- `sync-tokens.mjs` **fails** if a colour token does not convert, so a new token
  shape breaks the sync loudly instead of silently dropping a colour.

Installing the tokens package needs GitHub Packages auth — see
[Toolchain constraints](#toolchain-constraints).

---

## Layout

```
apps/
  mobile-web/        Expo Router app — iOS, Android, web
    app/             file-based routes; +html.tsx wraps the web build only
    global.css       imports the generated token vars, then Tailwind
    e2e/             Playwright (web) and Maestro (device) suites
  api/
    src/router.ts    tRPC procedures — add one per new contract
    src/context.ts   Prisma client + per-request context; wire auth here
    prisma/          schema; prisma.config.ts sits at the app root
    src/generated/   Prisma 7 output — gitignored, never edited
packages/
  ui/                shared NativeWind components
  api-contracts/     Zod schemas shared by client and server
  config/            eslint, tailwind (+ token bridge), tsconfig bases
  utils/             framework-free helpers
```

---

## Toolchain constraints

These are pinned deliberately. Each one was tried at a newer version and blocked
by something real — check the blocker still holds before bumping.

- **TypeScript stays on 6.x.** `ts-jest` peers `typescript <7` and
  `typescript-eslint` peers `<6.1.0`. TS 7 needs both to move first.
- **Jest stays on 29 across every package.** `jest-expo@57` requires it, and the
  hoisted layout means one jest major serves the whole workspace.
- **Tailwind stays on 3.x.** NativeWind 4 is built on `react-native-css-interop`,
  which targets Tailwind 3's JS config. Tailwind 4 needs NativeWind 5, which is
  preview-only.
- **`packages/ui` pins `react` and `react-native` to the app's exact versions.**
  A loose `*` peer let pnpm install a second React Native copy, and NativeWind's
  `className` type augmentation then landed on the wrong module — the symptom is
  `Property 'className' does not exist on type ...PressableProps`.
- **Each tsconfig names its test types explicitly** (`"types": ["jest", ...]`).
  TypeScript 6 does not auto-discover them in this layout.

### pnpm 11 gotchas

- **`.npmrc` no longer configures pnpm.** Settings live in
  `pnpm-workspace.yaml` — `nodeLinker: hoisted` in particular. Metro cannot
  resolve pnpm's default symlinked layout, so losing that setting breaks
  `expo start` while the type and test gates stay green.
- **Build scripts need approval.** `allowBuilds` in `pnpm-workspace.yaml` lists
  the five dependencies that compile native binaries or Prisma engines.
- **`@elirobinson/tokens` comes from GitHub Packages.** The scope mapping is in
  `.npmrc`; the token is user-level and never committed. pnpm 11 reads its
  credentials from its own store (`~/Library/Preferences/pnpm/auth.ini` on
  macOS) in preference to `~/.npmrc` — if an install 401s while `npm view`
  works, that store holds a stale token.

### Prisma 7 shape

Prisma 7 removed `url` from the schema's datasource block. The CLI reads the
connection string from `apps/api/prisma.config.ts`; the runtime client gets it
from a `@prisma/adapter-pg` adapter constructed in `src/context.ts`. The
generator is `prisma-client` (not `prisma-client-js`) and emits into
`src/generated/prisma`, which is gitignored.

### Testing note

React Native Testing Library 14 made `render` and every `fireEvent` helper
**async** — always `await` them. `@testing-library/react-native/extend-expect`
no longer exists; the matchers register themselves.
