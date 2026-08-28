import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ContactScreen() {
  return (
    <ScreenScaffold
      title="聯絡我們"
      subtitle="客服管道與問題回報。"
      sections={['常見問題捷徑', '問題分類與描述表單', '附加截圖', '客服信箱與服務時間']}
    />
  );
}
