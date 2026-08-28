import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function MessagesScreen() {
  return (
    <ScreenScaffold
      title="訊息"
      subtitle="與賣家的對話列表，點選後開啟聊天室。"
      sections={['對話列表與未讀數', '系統客服入口', '搜尋對話']}
    />
  );
}
