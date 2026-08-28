import { useLocalSearchParams } from 'expo-router';

import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerEditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenScaffold
      title="編輯商品"
      subtitle={`商品編號：${id ?? '未指定'}`}
      sections={['載入既有商品資料', '圖片與內容編輯', '規格、價格與庫存', '下架與刪除']}
    />
  );
}
