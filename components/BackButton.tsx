import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { BRAND } from '@/lib/brand';
import { goBackOrReplace } from '@/lib/navigation';

/**
 * Header back control. Falls back to the buyer home tab so a deep-linked or
 * refreshed screen still has a working way out.
 */
export function BackButton({ fallback = '/' }: { fallback?: '/' | '/seller' }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="返回"
      hitSlop={12}
      className="-ml-1 px-1 py-1 active:opacity-60"
      onPress={() => goBackOrReplace(fallback)}
    >
      <ChevronLeft color={BRAND.navy} size={26} />
    </Pressable>
  );
}
