import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function CartScreen() {
  return (
    <ScreenScaffold
      title="購物車"
      subtitle="依店鋪分組的購物車，可調整數量並前往結帳。"
      sections={['依店鋪分組的商品', '數量調整與刪除', '優惠券與運費試算', '前往結帳按鈕']}
    />
  );
}
