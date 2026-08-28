import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SignInScreen() {
  return (
    <ScreenScaffold
      title="登入 / 註冊"
      subtitle="手機或電子郵件登入，首次登入自動建立帳號。"
      sections={['登入表單與驗證', '註冊流程', '第三方登入', '同意服務條款與隱私權政策']}
    />
  );
}
