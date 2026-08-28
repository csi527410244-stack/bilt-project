import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerHomeScreen() {
  return (
    <ScreenScaffold
      title="賣家中心"
      subtitle="今日營運總覽與常用管理捷徑。"
      sections={[
        '今日訂單、營收與待處理數',
        '商品管理／新增商品捷徑',
        '銷售分析摘要',
        'J幣、優惠券與推廣入口',
        '店鋪設定捷徑',
      ]}
    />
  );
}
