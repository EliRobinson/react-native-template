import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'api';
import { Platform } from 'react-native';

// One client, shared by every screen on iOS, Android, and web.
// Point EXPO_PUBLIC_API_URL at your deployed API (or localhost while developing).
// AppRouter is type-only — do not value-import from `api` or Metro will pull server code.
export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  // Sensible local dev fallback: Android emulator can't reach `localhost`
  // directly, it needs the special 10.0.2.2 alias.
  return Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
}

export function getTrpcClientConfig() {
  return {
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
      }),
    ],
  };
}
