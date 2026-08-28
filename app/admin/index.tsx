import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function AdminScreen() {
  return (
    <ScreenScaffold
      title="平台管理"
      subtitle="平台端營運總覽與管理工具。"
      sections={[
        '平台數據總覽',
        '會員與賣家審核',
        '商品與評價檢舉處理',
        '公告發布',
        '物流串接設定入口',
      ]}
    />
  );
}
