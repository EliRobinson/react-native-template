import { PrismaPg } from '@prisma/adapter-pg';
import type { CreateUserInput, User } from '@repo/api-contracts';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import { env } from './env';
import { PrismaClient } from './generated/prisma/client';

// Prisma 7 takes its runtime connection from a driver adapter rather than
// from the schema's datasource block.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export type UserStore = {
  list: () => Promise<User[]>;
  create: (input: CreateUserInput) => Promise<User>;
};

export type Context = {
  userId: string | null;
  users: UserStore;
};

function createPrismaUserStore(client: PrismaClient): UserStore {
  return {
    list: () => client.user.findMany(),
    create: (input) => client.user.create({ data: input }),
  };
}

// Wire up your auth provider (e.g. Clerk) here to populate userId.
export function createContext({ req: _req }: CreateFastifyContextOptions): Context {
  return {
    userId: null,
    users: createPrismaUserStore(prisma),
  };
}
