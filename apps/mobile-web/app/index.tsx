import { Button } from '@repo/ui';
import { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { trpc } from '../src/lib/trpc';

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const health = trpc.health.useQuery();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Text className="text-2xl font-bold text-gray-900">Runs on iOS, Android &amp; Web</Text>
        <Text className="text-muted">
          API status:{' '}
          {health.isLoading ? 'checking…' : health.data?.ok ? 'connected ✅' : 'offline'}
        </Text>
        <Text className="text-lg">Count: {count}</Text>
        <Button onPress={() => setCount((c) => c + 1)} testID="increment-button">
          Tap me
        </Button>
      </View>
    </SafeAreaView>
  );
}
