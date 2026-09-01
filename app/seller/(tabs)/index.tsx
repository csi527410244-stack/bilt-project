import { MarketHome } from '@/components/MarketHome';

/**
 * 賣家分頁的首頁。內容與買家首頁相同（分類方塊、廣告、無限瀑布流）。
 *
 * 這是賣家介面的落點，所以不畫返回鍵；要回到買家介面走「我的」→ 回到買家介面。
 * 開啟時的彈出廣告只屬於買家首頁，賣家這邊不再攔一次。
 */
export default function SellerHomeScreen() {
  return <MarketHome showLaunchAd={false} />;
}
