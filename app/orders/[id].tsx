import { useLocalSearchParams } from 'expo-router';

import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenScaffold
      title="訂單詳情"
      subtitle={`訂單編號：${id ?? '未指定'}`}
      sections={['訂單狀態時間軸', '商品明細與金額', '收件與物流資訊', '聯絡賣家與售後動作']}
    />
  );
}
