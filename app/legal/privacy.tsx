import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function PrivacyScreen() {
  return (
    <ScreenScaffold
      title="隱私權政策"
      subtitle="說明資料蒐集、使用與使用者權利。"
      sections={['蒐集的資料類型', '使用與分享方式', '保存期限與安全措施', '使用者權利與聯絡方式']}
    />
  );
}
