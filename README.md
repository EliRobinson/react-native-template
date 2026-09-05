# RN + Web Template

One codebase that ships to iOS, Android, and web, backed by a fully
type-safe API. Use this as a GitHub template for new projects.

## Stack

| Layer          | Choice                                                |
| -------------- | ----------------------------------------------------- |
| Monorepo       | pnpm workspaces + Turborepo                           |
| Mobile + Web   | Expo Router (React Native Web) — one app, 3 targets   |
| Styling        | NativeWind (Tailwind for RN + web)                    |
| Design tokens  | `@elirobinson/tokens` — colour, space, radius, type   |
| State (server) | TanStack Query via tRPC                               |
| API            | Fastify + tRPC                                        |
| Database       | Prisma + Postgres                                     |
| Validation     | Zod schemas in `@repo/api-contracts`                  |
| Lint/format    | ESLint (flat config) + Prettier + Husky + lint-staged |
| Unit/component | Jest + React Native Testing Library                   |
| E2E (web)      | Playwright                                            |
| E2E (mobile)   | Maestro                                               |
| CI             | GitHub Actions + Turborepo remote caching             |
| Deploy         | EAS (mobile), Vercel/EAS Hosting (web)                |

Suggested next adds (not wired yet): Clerk (or another auth provider),
Zustand for client state, React Hook Form for forms.

## Structure

```
apps/
  mobile-web/     Expo Router app — iOS, Android, and web from one codebase
  api/            Fastify + tRPC server, Prisma, router implementation
packages/
  ui/             Shared components (NativeWind)
  api-contracts/  Shared Zod schemas — the contract between client and server
  utils/          Shared helpers (use when you have cross-app pure logic)
  config/         Shared ESLint, Tailwind, and tsconfig presets
```

Ownership to copy when you fork:

- **Schemas** live in `packages/api-contracts` (imported by the API, and by
  the client when you build forms).
- **Router + Prisma** live in `apps/api`. The client type-imports
  `AppRouter` from `api` — type-only, so Metro never bundles server code.
- Add a procedure in `apps/api/src/router.ts` and a schema in
  `packages/api-contracts` when the input/output shape is shared.

## Getting started

Requires **Node 24** (see `.nvmrc`) and **pnpm 11**.

The design system package comes from GitHub Packages, so you need a personal
access token with `read:packages` in your user-level `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=<your token>
```

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # set DATABASE_URL
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate

pnpm dev:api          # starts the Fastify/tRPC server on :4000
pnpm dev:mobile-web   # starts Expo — press i / a / w for iOS/Android/web
```

## Common commands

```bash
pnpm lint          # ESLint across every app/package
pnpm typecheck     # tsc --noEmit across every app/package
pnpm test          # Jest unit + component tests
pnpm test:e2e:web  # Playwright, against the web build
pnpm --filter mobile-web test:e2e:mobile   # Maestro, needs a simulator/device
pnpm format        # Prettier write
pnpm tokens:sync   # regenerate the Tailwind theme from @elirobinson/tokens
```

## Styling

Colour, spacing, radii and type come from `@elirobinson/tokens`. Use the utility
that names the token (`bg-accent`, `text-fg-2`, `rounded-md`) rather than a
literal value, and run `pnpm tokens:sync` after bumping that package. See
[AGENTS.md](AGENTS.md#styling-design-system-tokens) for how the bridge works.

## Using this as a template

1. Rename `mobileweb` / `com.yourorg.mobileweb` in `apps/mobile-web/app.json`.
2. Set up EAS (`eas init`) for mobile builds/submits.
3. Point `DATABASE_URL` at a real Postgres instance (Supabase, Neon, RDS, etc.).
4. Wire up auth in `apps/api/src/context.ts` and add a `protectedProcedure`
   in `apps/api/src/trpc.ts`.
5. Add a `TURBO_TOKEN`/`TURBO_TEAM` secret in GitHub if you want Turborepo
   remote caching in CI (optional but speeds PRs up a lot).

## ✅ Before committing this to the template repo

Go through this list before you mark the repo "Template repository" on GitHub:

- [ ] Run `pnpm install` locally at least once and commit the resulting
      `pnpm-lock.yaml` — an unlocked template will drift immediately.
- [ ] Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` and confirm all pass clean.
- [ ] Delete this checklist section (and the "Using this as a template"
      section above) once you've actually done those steps, or leave it —
      your call, but don't ship it half-followed.
- [ ] Replace every occurrence of `mobileweb` / `com.yourorg.mobileweb`
      (in `app.json`) with your real app name and bundle ID.
- [ ] Replace `yourorg` in `apps/mobile-web/e2e/maestro/flow.yaml`'s `appId` too.
- [ ] Decide on a real Postgres provider and update `apps/api/.env.example`
      accordingly (don't commit a real `.env` — it's gitignored, keep it that way).
- [ ] Confirm `.gitignore` covers your provider's local artifacts (e.g. add
      `.vercel/`, `.eas/` if those tools generate local config you don't want committed).
- [ ] If you want Turborepo remote caching in CI, add `TURBO_TOKEN` and
      `TURBO_TEAM` as GitHub Actions secrets — otherwise CI still works,
      just without cross-run caching.
- [ ] If you want the Release workflow to actually open PRs, confirm
      Actions has "Read and write permissions" enabled under
      **Settings → Actions → General → Workflow permissions**.
- [ ] Add a LICENSE file appropriate for how this template will be reused.
- [ ] Smoke-test all three targets once end-to-end: `pnpm dev:web` in a
      browser, `pnpm dev:ios`/`dev:android` in a simulator, and
      `pnpm dev:api` responding on `/health`.
- [ ] Squash/clean the git history so the template's first commit is tidy —
      nobody forking it needs your scaffolding commits.

## Extending

- **New shared component:** add it to `packages/ui/src`, export from
  `packages/ui/src/index.ts`. It's usable from `apps/mobile-web` immediately.
- **New API endpoint:** add a Zod schema to `packages/api-contracts/src/schemas`
  when the shape is shared; add the procedure in `apps/api/src/router.ts`
  and talk to Prisma via `ctx.users` (or a new store on `Context`).
- **Need real SSR/SEO for web later:** the `ui`/`api-contracts`/`utils`
  packages don't know or care what renders them — you can swap the web
  target for a Next.js app without touching shared code.
