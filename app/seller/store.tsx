import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerStoreSettingsScreen() {
  return (
    <ScreenScaffold
      title="店鋪設定"
      subtitle="店鋪外觀、公告、出貨與客服設定。"
      sections={[
        '店鋪名稱與頭像',
        '店鋪公告與簡介',
        '出貨與退換貨政策',
        '客服回覆時間',
        '休假模式',
      ]}
    />
  );
}
