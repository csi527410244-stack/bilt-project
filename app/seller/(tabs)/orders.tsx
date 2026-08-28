import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerOrdersScreen() {
  return (
    <ScreenScaffold
      title="賣家訂單"
      subtitle="依狀態處理訂單：待出貨、已出貨、已完成、取消與退款。"
      sections={['狀態分頁與數量', '訂單卡片與買家資訊', '出貨與物流單號', '退款與取消處理']}
    />
  );
}
