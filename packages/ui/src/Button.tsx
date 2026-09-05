import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  testID?: string;
};

// Every class here names a design system token (@elirobinson/tokens), so the
// colours follow the system — including the dark values — without this file
// knowing what any of them are. NativeWind's `className` works identically on
// iOS, Android and web.
export function Button({ onPress, children, variant = 'primary', testID }: ButtonProps) {
  const base = 'rounded-md px-4 py-3 items-center justify-center';
  const styles = variant === 'primary' ? `${base} bg-accent` : `${base} bg-bg-muted`;
  const textStyles =
    variant === 'primary' ? 'text-accent-fg font-semibold' : 'text-fg font-semibold';

  return (
    <Pressable accessibilityRole="button" className={styles} onPress={onPress} testID={testID}>
      <Text className={textStyles}>{children}</Text>
    </Pressable>
  );
}
