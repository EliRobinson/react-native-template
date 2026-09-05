import { defineConfig } from 'prisma/config';

// Prisma 7 reads CLI configuration from here instead of the schema file.
// Only the CLI (migrate, studio, db push) uses this connection string;
// the runtime client gets its connection from the adapter in src/context.ts.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
