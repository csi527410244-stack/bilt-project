import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function FavoritesScreen() {
  return (
    <ScreenScaffold
      title="我的收藏"
      subtitle="收藏的商品與追蹤的店鋪。"
      sections={['收藏商品列表', '追蹤店鋪列表', '批次移除', '空狀態引導']}
    />
  );
}
