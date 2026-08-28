import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerOnboardingScreen() {
  return (
    <ScreenScaffold
      title="成為極貨網賣家"
      subtitle="開店申請流程：基本資料、驗證與條款同意。"
      sections={['開店權益說明', '店鋪名稱與分類', '身分與收款驗證', '賣家條款同意與送出']}
    />
  );
}
