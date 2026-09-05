# @repo/utils

## 1.0.0

### Major Changes

- 942d63b: Modernize the whole toolchain: Expo 57 (React 19.2, React Native 0.86), Prisma 7
  with a driver adapter, Zod 4, Fastify 5, TypeScript 6, ESLint 10, and pnpm 11.

  Breaking for consumers of these packages:

  - `@repo/ui` now requires React >= 19 and React Native >= 0.86.
  - `@repo/api-contracts` emits Zod 4 schemas; `z.string().uuid()`/`.email()`/`.url()`
    are now `z.uuid()`/`z.email()`/`z.url()`.
  - `@repo/config`'s ESLint preset targets ESLint 10 flat config.
