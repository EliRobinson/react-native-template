import cors from '@fastify/cors';
import { appRouter } from '@repo/api-contracts';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';

import { createContext } from './context';
import { env } from './env';

const server = Fastify({ logger: true });

async function main() {
  await server.register(cors, { origin: true });

  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  server.get('/health', async () => ({ ok: true }));

  await server.listen({ port: env.PORT, host: '0.0.0.0' });
}

main().catch((err) => {
  server.log.error(err);
  process.exit(1);
});
