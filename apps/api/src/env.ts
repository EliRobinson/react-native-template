import { z } from 'zod';

// Fails fast at boot if required env vars are missing/malformed,
// instead of surfacing a confusing runtime error later.
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(4000),
  CLERK_SECRET_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
