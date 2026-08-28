import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerPromoteScreen() {
  return (
    <ScreenScaffold
      title="兌換推廣"
      subtitle="以J幣兌換曝光與推廣位。"
      sections={['推廣方案列表與所需J幣', '選擇商品與期間', '兌換確認', '推廣成效追蹤']}
    />
  );
}
