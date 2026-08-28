import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerProductsScreen() {
  return (
    <ScreenScaffold
      title="商品管理"
      subtitle="上架、下架、庫存與價格維護。"
      sections={['商品列表與狀態篩選', '搜尋商品', '上架／下架切換', '編輯與刪除', '新增商品捷徑']}
    />
  );
}
