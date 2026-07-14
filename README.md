# RN + Web Template

One codebase that ships to iOS, Android, and web, backed by a fully
type-safe API. Use this as a GitHub template for new projects.

## Stack

| Layer          | Choice                                                    |
| -------------- | --------------------------------------------------------- |
| Monorepo       | pnpm workspaces + Turborepo                               |
| Mobile + Web   | Expo Router (React Native Web) — one app, 3 targets       |
| Styling        | NativeWind (Tailwind for RN + web)                        |
| State (server) | TanStack Query via tRPC                                   |
| State (client) | Zustand                                                   |
| Forms          | React Hook Form + Zod                                     |
| API            | Fastify + tRPC                                            |
| Database       | Prisma + Postgres                                         |
| Auth           | Clerk (swap for anything — see `apps/api/src/context.ts`) |
| Validation     | Zod, shared between client and server                     |
| Lint/format    | ESLint (flat config) + Prettier + Husky + lint-staged     |
| Unit/component | Jest + React Native Testing Library                       |
| E2E (web)      | Playwright                                                |
| E2E (mobile)   | Maestro                                                   |
| CI             | GitHub Actions + Turborepo remote caching                 |
| Versioning     | Changesets (per-package changelogs, no npm publish)       |
| Deploy         | EAS (mobile), Vercel/EAS Hosting (web)                    |

## Structure

```
apps/
  mobile-web/     Expo Router app — iOS, Android, and web from one codebase
  api/            Fastify + tRPC server, Prisma schema
packages/
  ui/             Shared components (NativeWind)
  api-contracts/  tRPC router + Zod schemas — the shared source of truth
                  for types between client and server
  utils/          Shared helpers
  config/         Shared ESLint, Tailwind, and tsconfig presets
```

The important dependency to understand: `packages/api-contracts` is
imported by both `apps/api` (the server) and `apps/mobile-web` (the
client). Add a procedure to the router or a field to a Zod schema, and
both sides pick up the type change immediately — no codegen step.

## Getting started

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # set DATABASE_URL
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
```

## Versioning changes (Changesets)

After any change worth noting, run:

```bash
pnpm changeset
```

It'll ask which package(s) changed and whether it's a patch/minor/major,
then write a small file in `.changeset/`. Commit that alongside your PR.
When it's merged to `main`, the Release workflow (`.github/workflows/release.yml`)
opens/updates a "Version Packages" PR that bumps versions and writes
CHANGELOGs; merging _that_ PR is what finalizes a release. Nothing gets
published to npm — this is an app template, so changesets are just used
to keep a clean changelog per package as things evolve.

## Using this as a template

1. Rename `mobileweb` / `com.yourorg.mobileweb` in `apps/mobile-web/app.json`.
2. Set up EAS (`eas init`) for mobile builds/submits.
3. Point `DATABASE_URL` at a real Postgres instance (Supabase, Neon, RDS, etc.).
4. Wire up Clerk (or your auth provider) in `apps/api/src/context.ts` and
   add a `protectedProcedure` in `packages/api-contracts/src/trpc.ts`.
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
- [ ] Decide whether Clerk is actually your auth provider; if not, remove the
      Clerk references in `apps/api/src/env.ts` and `context.ts` and swap in yours.
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
- **New API endpoint:** add a Zod schema to `packages/api-contracts/src/schemas`,
  add a procedure to `packages/api-contracts/src/router.ts`, implement the
  resolver logic (Prisma calls, etc.) inline or in `apps/api/src`.
- **Need real SSR/SEO for web later:** the `ui`/`api-contracts`/`utils`
  packages don't know or care what renders them — you can swap the web
  target for a Next.js app without touching shared code.
