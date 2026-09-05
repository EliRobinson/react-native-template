import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { colorScheme } from 'nativewind';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getTrpcClientConfig, trpc } from '../src/lib/trpc';

// The Tailwind preset uses darkMode: 'class', because Expo Router sets the
// colour scheme programmatically and NativeWind's media-query dark mode cannot
// follow that. 'class' means nothing toggles dark on its own, so this tells
// NativeWind to track the OS setting — without it the .dark token block ships
// in the bundle and never applies.
colorScheme.set('system');

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient(getTrpcClientConfig()));

  return (
    <SafeAreaProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
      </trpc.Provider>
    </SafeAreaProvider>
  );
}
