import type { Context } from '@repo/api-contracts';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

// Real implementation of the Context type shared with the client.
// Wire up your auth provider (e.g. Clerk) here to populate userId.
export function createContext({ req: _req }: CreateFastifyContextOptions): Context {
  return {
    userId: null,
  };
}
