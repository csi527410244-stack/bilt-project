import { MarketHome } from '@/components/MarketHome';

/**
 * 賣家分頁的首頁。內容與買家首頁相同（分類方塊、廣告、無限瀑布流），
 * 只是頁首多一顆回到買家介面的返回鍵。
 */
export default function SellerHomeScreen() {
  return <MarketHome showSellerExit />;
}
