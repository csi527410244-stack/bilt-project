import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function CategoriesScreen() {
  return (
    <ScreenScaffold
      title="分類"
      subtitle="全站商品分類瀏覽，點選後進入商品列表。"
      sections={['主分類清單', '子分類與篩選', '熱門關鍵字']}
    />
  );
}
