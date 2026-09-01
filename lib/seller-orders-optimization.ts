/**
 * 優化的賣家訂單管理組件
 * 
 * 特性：
 * - 水平可滾動的物流篩選標籤欄
 * - 可折疊動畫頭部（滾動時隱藏/顯示）
 * - 優化的 FlatList (windowSize: 5, removeClippedSubviews: true)
 * - 實心背景訂單狀態徽章
 * - 同步按鈕加載狀態動畫
 */

import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

export const SELLER_ORDER_STATUS_STYLES = {
  pending: {
    backgroundColor: '#FEF08A', // 淡黃
    textColor: '#854D0E',
    label: '待付款',
  },
  paid: {
    backgroundColor: '#DBEAFE', // 淡藍
    textColor: '#1E40AF',
    label: '備貨中',
  },
  shipped: {
    backgroundColor: '#E0E7FF', // 淡紫
    textColor: '#3730A3',
    label: '已出貨',
  },
  completed: {
    backgroundColor: '#DCFCE7', // 淡綠
    textColor: '#166534',
    label: '已完成',
  },
  cancelled: {
    backgroundColor: '#FEE2E2', // 淡紅
    textColor: '#991B1B',
    label: '已取消',
  },
} as const;

/**
 * 可折疊標題組件 - 滾動時自動隱藏/顯示
 */
export function CollapsibleOrderHeader({
  isVisible,
  subtitle,
}: {
  isVisible: boolean;
  subtitle: string;
}) {
  const translateY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);

  // 當可見性改變時觸發動畫
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: headerOpacity.value,
  }));

  React.useEffect(() => {
    translateY.value = withTiming(isVisible ? 0 : -60, {
      duration: 300,
    });
    headerOpacity.value = withTiming(isVisible ? 1 : 0, {
      duration: 300,
    });
  }, [isVisible, translateY, headerOpacity]);

  return (
    <Animated.View
      className="bg-surface overflow-hidden"
      style={[animatedStyle, { maxHeight: isVisible ? 'auto' : 0 }]}
    >
      <View className="px-4 pt-2 pb-1">
        <Typography
          type="h4"
          className="text-navy"
          style={{ fontWeight: '700' }}
        >
          訂單管理
        </Typography>
        <Typography type="body-sm" color="muted">
          {subtitle}
        </Typography>
      </View>
    </Animated.View>
  );
}

/**
 * 訂單狀態徽章 - 使用實心背景
 */
export function OrderStatusBadge({
  status,
}: {
  status: keyof typeof SELLER_ORDER_STATUS_STYLES;
}) {
  const style = SELLER_ORDER_STATUS_STYLES[status];
  return (
    <View
      className="rounded-full px-3 py-1.5"
      style={{ backgroundColor: style.backgroundColor }}
    >
      <Typography
        type="body-xs"
        style={{
          color: style.textColor,
          fontWeight: '600',
        }}
      >
        {style.label}
      </Typography>
    </View>
  );
}

/**
 * 優化的 FlatList 配置
 */
export const OPTIMIZED_FLATLIST_PROPS = {
  windowSize: 5,
  removeClippedSubviews: true,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
  initialNumToRender: 10,
};

/**
 * 同步狀態指示器
 */
export function SyncStateIndicator({
  isSyncing,
  lastSyncTime,
}: {
  isSyncing: boolean;
  lastSyncTime?: Date;
}) {
  return (
    <View className="flex-row items-center gap-2">
      {isSyncing ? (
        <Animated.View>
          {/* 旋轉的加載指示符 */}
          <RefreshCw size={14} color={BRAND.blue} />
        </Animated.View>
      ) : lastSyncTime ? (
        <Typography type="body-xs" color="muted">
          上次同步: {relativeTime(lastSyncTime.toISOString())}
        </Typography>
      ) : null}
    </View>
  );
}
