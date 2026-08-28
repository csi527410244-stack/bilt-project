import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function OrderListScreen() {
  return (
    <ScreenScaffold
      title="我的訂單"
      subtitle="依狀態分頁檢視訂單：待付款、待出貨、已出貨、已完成。"
      sections={['狀態分頁', '訂單卡片列表', '取消／確認收貨動作', '前往評價']}
    />
  );
}
