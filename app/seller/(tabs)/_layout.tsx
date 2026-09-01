import { useCallback } from 'react';
import { Tabs, usePathname } from 'expo-router';

import { SellerTabBar } from '@/components/SellerTabBar';
import { SwipeBackArea } from '@/components/SwipeBackArea';
import { BRAND } from '@/lib/brand';
import { goBackOrReplace } from '@/lib/navigation';

/** 自訂分頁列（市集／首頁／發布／訂單／訊息／我的），發布不是分頁而是推入的頁面。 */
const renderTabBar = () => <SellerTabBar />;

/**
 * 賣家介面的分頁導覽 —— 與買家 (tabs) 同一套機制：畫面第一次進去後就留在記憶體裡，
 * 之後切分頁只是切換焦點，不會重新掛載，所以底部導覽與頁首在載入資料時不會消失。
 *
 * 檔案是群組目錄 (tabs)，所以網址仍然是 /seller、/seller/market、/seller/orders…
 */
export default function SellerTabsLayout() {
  // 從螢幕左緣往右滑 = 返回（賣家首頁是落點，沒有可返回的地方）。
  const pathname = usePathname();
  const onSwipeBack = useCallback(() => goBackOrReplace('/seller'), []);

  return (
    <SwipeBackArea onBack={onSwipeBack} enabled={pathname !== '/seller'}>
      <Tabs
        tabBar={renderTabBar}
        // 返回 = 回到剛才看的那個分頁（例如「我的」→ 訂單管理 → 返回會回到「我的」）。
        // 預設的 'firstRoute' 會一律跳回賣家首頁。
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          // 切分頁不做轉場動畫，點下去就換頁。
          animation: 'none',
          // 沒在看的分頁停止重新渲染：訊息與訂單是輪詢來的，沒有這個設定時每次輪詢
          // 都會讓所有已載入的分頁一起重繪，點分頁列就會有延遲感。
          freezeOnBlur: true,
          sceneStyle: { backgroundColor: BRAND.background },
        }}
      >
        {/* index 放第一個：它是這個群組的預設落點（/seller）。賣家首頁直接顯示買家的 MarketHome。 */}
        <Tabs.Screen name="index" />
        <Tabs.Screen name="orders" />
        <Tabs.Screen name="messages" />
        <Tabs.Screen name="account" />
      </Tabs>
    </SwipeBackArea>
  );
}
