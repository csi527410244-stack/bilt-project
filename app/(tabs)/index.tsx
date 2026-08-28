import { ScreenScaffold } from '@/components/ScreenScaffold';

export default function HomeScreen() {
  return (
    <ScreenScaffold
      title="首頁"
      subtitle="極貨網買家入口：搜尋、輪播、分類捷徑與推薦商品。"
      sections={[
        '搜尋列與掃描入口',
        '主視覺輪播與活動banner',
        '分類捷徑',
        '限時特賣與推薦商品',
        '最近瀏覽捷徑',
      ]}
    />
  );
}
