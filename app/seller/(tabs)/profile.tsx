import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerProfileScreen() {
  return (
    <ScreenScaffold
      title="賣家帳號"
      subtitle="店鋪資訊、帳務與設定入口。"
      sections={['店鋪基本資料', '收款與帳務', '評價與回覆入口', '切換回買家端']}
    />
  );
}
