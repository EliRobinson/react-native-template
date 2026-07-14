import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  testID?: string;
};

// NativeWind's `className` works identically here whether this renders
// on iOS, Android, or web (react-native-web) — one component, one style
// language, three platforms.
export function Button({ onPress, children, variant = 'primary', testID }: ButtonProps) {
  const base = 'rounded-lg px-4 py-3 items-center justify-center';
  const styles = variant === 'primary' ? `${base} bg-primary` : `${base} bg-gray-200`;
  const textStyles =
    variant === 'primary' ? 'text-white font-semibold' : 'text-gray-900 font-semibold';

  return (
    <Pressable className={styles} onPress={onPress} testID={testID}>
      <Text className={textStyles}>{children}</Text>
    </Pressable>
  );
}
