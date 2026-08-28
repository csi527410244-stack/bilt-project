import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function ProfileScreen() {
  return (
    <ScreenScaffold
      title="我的"
      subtitle="帳號中心：訂單、收藏、通知、賣家入口與設定。"
      sections={[
        '帳號資訊與登入狀態',
        '我的訂單／收藏／最近瀏覽',
        '通知中心',
        '成為賣家與賣家中心入口',
        '設定、法務條款與聯絡我們',
      ]}
    />
  );
}
