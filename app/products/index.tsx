import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ProductListScreen() {
  return (
    <ScreenScaffold
      title="商品列表"
      subtitle="搜尋結果與分類商品，支援排序與篩選。"
      sections={['關鍵字與分類結果', '排序與篩選', '商品卡片列表（虛擬化）', '無結果狀態']}
    />
  );
}
