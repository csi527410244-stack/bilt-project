import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function SellerCoinsScreen() {
  return (
    <ScreenScaffold
      title="J幣中心"
      subtitle="J幣餘額、收支紀錄與用途。"
      sections={['餘額與即將到期', '收支明細', '取得J幣的方式', '兌換推廣入口']}
    />
  );
}
