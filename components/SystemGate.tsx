import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Spinner } from 'heroui-native';

import { BrandText } from '@/components/brand/BrandText';
import { BRAND } from '@/lib/brand';
import { useSessionStore } from '@/lib/session';

/**
 * Holds the navigator back until app-wide state (the stored session) is ready,
 * so screens never render a signed-out frame and then flip to signed-in.
 */
export function SystemGate({ children }: { children: ReactNode }) {
  const hydrated = useSessionStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <View className="bg-background flex-1 items-center justify-center gap-4">
        <BrandText style={{ fontSize: 28, fontWeight: '700', color: BRAND.navy, letterSpacing: 1 }}>
          {BRAND.name}
        </BrandText>
        <Spinner size="md" />
      </View>
    );
  }

  return <>{children}</>;
}
