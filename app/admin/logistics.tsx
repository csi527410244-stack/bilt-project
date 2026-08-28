import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function AdminLogisticsScreen() {
  return (
    <ScreenScaffold
      title="物流串接設定"
      subtitle="設定物流商、運費規則與追蹤串接。"
      sections={['物流商清單與啟用狀態', 'API 金鑰與端點設定', '運費規則與級距', '串接測試與紀錄']}
    />
  );
}
