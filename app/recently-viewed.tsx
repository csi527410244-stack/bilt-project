import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function RecentlyViewedScreen() {
  return (
    <ScreenScaffold
      title="最近瀏覽"
      subtitle="近期看過的商品，依時間分組。"
      sections={['依日期分組的商品', '清除瀏覽紀錄', '空狀態引導']}
    />
  );
}
