import { initTRPC } from '@trpc/server';

import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
// Swap in real auth middleware here once Clerk (or your provider) is wired up:
// export const protectedProcedure = t.procedure.use(isAuthed);
