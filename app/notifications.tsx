import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function NotificationsScreen() {
  return (
    <ScreenScaffold
      title="通知中心"
      subtitle="訂單、優惠與系統公告通知。"
      sections={['通知分類分頁', '未讀標記與全部已讀', '點擊跳轉對應頁面', '推播權限提示']}
    />
  );
}
