import { useLocalSearchParams } from 'expo-router';

import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function StoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenScaffold
      title="店鋪"
      subtitle={`店鋪編號：${id ?? '未指定'}`}
      sections={['店鋪主視覺與評分', '追蹤店鋪', '商品分類與列表', '店鋪優惠券']}
    />
  );
}
