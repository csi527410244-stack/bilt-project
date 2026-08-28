import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerMessagesScreen() {
  return (
    <ScreenScaffold
      title="買家訊息"
      subtitle="買家詢問的對話列表。"
      sections={['對話列表與未讀數', '快速回覆範本', '依訂單篩選']}
    />
  );
}
