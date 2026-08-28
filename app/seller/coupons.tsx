import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerCouponsScreen() {
  return (
    <ScreenScaffold
      title="優惠券"
      subtitle="建立與管理店鋪優惠券。"
      sections={['進行中／已結束分頁', '新增優惠券表單', '折扣條件與期限', '使用成效']}
    />
  );
}
