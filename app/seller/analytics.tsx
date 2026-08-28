import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerAnalyticsScreen() {
  return (
    <ScreenScaffold
      title="銷售分析"
      subtitle="營收、訂單與商品成效趨勢。"
      sections={['期間選擇', '營收與訂單趨勢圖', '熱銷商品排行', '流量與轉換率']}
    />
  );
}
