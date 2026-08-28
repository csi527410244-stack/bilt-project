import { useLocalSearchParams } from 'expo-router';

import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenScaffold
      title="商品詳情"
      subtitle={`商品編號：${id ?? '未指定'}`}
      sections={[
        '圖片輪播與價格',
        '規格選擇與庫存',
        '店鋪資訊與客服',
        '評價區塊',
        '加入購物車／立即購買',
      ]}
    />
  );
}
