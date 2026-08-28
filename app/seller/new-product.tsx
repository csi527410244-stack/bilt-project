import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerNewProductScreen() {
  return (
    <ScreenScaffold
      title="新增商品"
      subtitle="建立商品：圖片、規格、價格與庫存。"
      sections={[
        '圖片上傳',
        '標題、分類與描述',
        '規格與價格',
        '庫存與運送設定',
        '儲存草稿／直接上架',
      ]}
    />
  );
}
