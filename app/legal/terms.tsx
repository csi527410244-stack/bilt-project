import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function TermsScreen() {
  return (
    <ScreenScaffold
      title="服務條款"
      subtitle="平台使用規則、交易責任與帳號管理。"
      sections={['服務範圍', '帳號與使用規範', '交易、付款與退款', '賣家義務', '條款變更']}
    />
  );
}
