import { Platform, Pressable, View } from 'react-native';
import { Typography } from 'heroui-native';
import { ChevronLeft } from 'lucide-react-native';
import type { Href } from 'expo-router';

import { BRAND } from '@/lib/brand';
import { goBackOrReplace } from '@/lib/navigation';

/**
 * 分頁畫面（買家與賣家兩邊都有）自己畫的返回鍵。
 *
 * 分頁沒有系統頁首，所以返回鍵畫在內容最上面。按下先退回上一頁；如果這一頁是
 * 直接開起來的（沒有上一頁可退），就退到該介面的首頁 fallback。
 */
export function ScreenBackButton({ fallback, label = '返回' }: { fallback: Href; label?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      className="-ml-1 self-start py-1"
      style={({ pressed }) => ({
        opacity: pressed ? 0.55 : 1,
        ...(Platform.OS === 'web' ? { cursor: 'pointer' } : null),
      })}
      onPress={() => goBackOrReplace(fallback)}
    >
      <View className="flex-row items-center gap-0.5">
        <ChevronLeft size={20} color={BRAND.navy} />
        <Typography type="body-sm" className="text-navy" style={{ fontWeight: '600' }}>
          {label}
        </Typography>
      </View>
    </Pressable>
  );
}
