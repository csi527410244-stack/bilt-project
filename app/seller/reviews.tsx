import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerReviewsScreen() {
  return (
    <ScreenScaffold
      title="買家評價與回覆"
      subtitle="檢視評價並回覆買家。"
      sections={['評價列表與星等篩選', '未回覆優先', '回覆輸入與送出', '申訴不當評價']}
    />
  );
}
