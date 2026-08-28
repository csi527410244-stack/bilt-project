import { Redirect } from 'expo-router';

/**
 * 「市集」分頁只是切回買家端的入口；正常點擊由分頁 listener 攔下，
 * 直接開這個網址時則導回買家首頁。
 */
export default function SellerMarketplaceTab() {
  return <Redirect href="/" />;
}
