import { useLocalSearchParams } from 'expo-router';

import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ReviewScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();

  return (
    <ScreenScaffold
      title="評價商品"
      subtitle={`商品編號：${productId ?? '未指定'}`}
      sections={['星等評分', '文字評論與照片上傳', '匿名選項', '送出評價']}
    />
  );
}
