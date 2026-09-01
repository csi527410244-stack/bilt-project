import { Platform, Pressable, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import type { Href } from 'expo-router';

import { BRAND } from '@/lib/brand';
import { goBackOrReplace } from '@/lib/navigation';

/**
 * 分頁畫面（買家與賣家兩邊都有）自己畫的返回鍵。
 *
 * 分頁沒有系統頁首，所以返回鍵畫在內容最上面。長相刻意和分頁列的「發布」一致：
 * 實心圓底 + 圖示，不寫「返回」兩個字。按下先退回上一頁；如果這一頁是直接開起來的
 * （沒有上一頁可退），就退到該介面的首頁 fallback。
 *
 * 同一個返回動作也有手勢版本，見 components/SwipeBackArea.tsx。
 */
export function ScreenBackButton({ fallback }: { fallback: Href }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="返回"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className="self-start"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        ...(Platform.OS === 'web' ? { cursor: 'pointer' } : null),
      })}
      onPress={() => goBackOrReplace(fallback)}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 32, height: 32, backgroundColor: BRAND.blue }}
      >
        <ChevronLeft size={20} color={BRAND.white} strokeWidth={2.6} />
      </View>
    </Pressable>
  );
}
