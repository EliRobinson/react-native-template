import { Button } from '@repo/ui';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { trpc } from '../src/lib/trpc';

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const health = trpc.health.useQuery();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-bold text-fg">Runs on iOS, Android &amp; Web</Text>
        <Text className="text-fg-2">
          API status:{' '}
          {health.isLoading ? 'checking…' : health.data?.ok ? 'connected ✅' : 'offline'}
        </Text>
        <Text className="text-lg text-fg">Count: {count}</Text>
        <Button onPress={() => setCount((c) => c + 1)} testID="increment-button">
          Tap me
        </Button>
      </View>
    </SafeAreaView>
  );
}
