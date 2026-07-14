import type { z } from 'zod';

import type { userSchema } from './schemas/user';
import { createUserInput } from './schemas/user';
import { publicProcedure, router } from './trpc';

// Example router — replace with real resolvers backed by Prisma in apps/api.
// This file (and the Zod schemas above) is imported by BOTH the server
// (apps/api) and the client (apps/mobile-web), which is what gives you
// end-to-end type safety with no code generation step.
export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true, ts: Date.now() })),

  users: router({
    list: publicProcedure.query(async () => {
      return [] as Array<z.infer<typeof userSchema>>;
    }),

    create: publicProcedure.input(createUserInput).mutation(async ({ input }) => {
      return {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        ...input,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
