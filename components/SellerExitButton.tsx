import { Platform, Pressable, View } from 'react-native';
import { Typography } from 'heroui-native';
import { ChevronLeft } from 'lucide-react-native';

import { BRAND } from '@/lib/brand';
import { exitSellerMode } from '@/lib/mode';

/**
 * 賣家分頁（首頁／訂單／訊息／我的）的返回鍵。
 *
 * 這四頁沒有頁首，所以返回鍵畫在內容的最上面；按下就把介面切回買家端，
 * 而不是退回上一頁 —— 分頁本身沒有「上一頁」可退。
 */
export function SellerExitButton({ label = '買家介面' }: { label?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="返回買家介面"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      className="-ml-1 self-start py-1"
      style={({ pressed }) => ({
        opacity: pressed ? 0.55 : 1,
        ...(Platform.OS === 'web' ? { cursor: 'pointer' } : null),
      })}
      onPress={exitSellerMode}
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
