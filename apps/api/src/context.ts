import { PrismaClient } from '@prisma/client';
import type { CreateUserInput, User } from '@repo/api-contracts';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

const prisma = new PrismaClient();

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
