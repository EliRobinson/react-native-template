# Agent Instructions

This is a pnpm + Turborepo monorepo: Expo Router app (`apps/mobile-web`, iOS/Android/web
from one codebase) and a Fastify + tRPC API (`apps/api`), with shared packages in `packages/*`
(`ui`, `api-contracts`, `utils`, `config`).

## Rules

- Use `pnpm`, not `npm` or `yarn` — the repo pins `packageManager` in `package.json`.
- Shared request/response schemas belong in `packages/api-contracts` (Zod), not duplicated
  client-side. Add a router procedure in `apps/api/src/router.ts` alongside any new schema.
- The client only type-imports `AppRouter` from `apps/api` — never import server runtime code
  (Prisma, handlers) from `apps/mobile-web`.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before considering a change done.
- Follow Conventional Commits (enforced by commitlint + Husky) — e.g. `fix(api): ...`,
  `feat(ui): ...`.
- Add a changeset (`pnpm changeset`) for any user-facing or package-level change.
- Styling is NativeWind (Tailwind) — keep styles in className props, not StyleSheet, unless a
  case genuinely needs it.
