import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ProfileDeleteScreen() {
  return (
    <ScreenScaffold
      title="刪除帳號"
      subtitle="說明刪除後的影響，並要求明確確認。"
      sections={['刪除影響說明', '未完成訂單檢查', '輸入確認字串', '刪除確認對話框']}
    />
  );
}
