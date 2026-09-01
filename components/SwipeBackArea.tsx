import { useMemo, type ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

/**
 * 分頁畫面的「從左緣往右滑返回」手勢。
 *
 * 分頁不是推入的畫面，所以系統本身沒有滑動返回；這裡自己補上，行為和 iOS 一致：
 * 只有從螢幕左緣 44px 內開始、明顯往右拉的手勢才算，往上下滑動一律讓給清單捲動。
 *
 * 手勢包在整個分頁導覽外面（而不是覆蓋一條看不見的長條），所以左側的商品卡、
 * 清單項目照樣點得到 —— 點擊沒有位移，不會觸發平移手勢。
 */
export function SwipeBackArea({
  onBack,
  enabled = true,
  children,
}: {
  onBack: () => void;
  /** 落點畫面（買家首頁／賣家首頁）沒有可返回的地方，就關掉手勢。 */
  enabled?: boolean;
  children: ReactNode;
}) {
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        // 回呼直接跑在 JS 執行緒，導覽本來就要在 JS 端做，省掉 worklet 的來回。
        .runOnJS(true)
        .enabled(enabled)
        // 只認螢幕左緣起手，避免和輪播、橫向捲動的區塊打架。
        .hitSlop({ left: 0, width: 44 })
        .activeOffsetX(24)
        .failOffsetY([-18, 18])
        .onEnd((event, success) => {
          if (!success) return;
          if (event.translationX > 60 || event.velocityX > 600) onBack();
        }),
    [enabled, onBack],
  );

  // 網頁版有瀏覽器自己的上一頁，不需要（也不該）攔滑鼠拖曳。
  if (Platform.OS === 'web') {
    return <View className="flex-1">{children}</View>;
  }

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-1">{children}</View>
    </GestureDetector>
  );
}
