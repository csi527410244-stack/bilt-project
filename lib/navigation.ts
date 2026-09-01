import { router, type Href } from 'expo-router';

import type { AppMode } from '@/lib/mode';

/** 兩邊的「我的」清單 —— 所有功能頁的返回落點。 */
const BUYER_MENU: Href = '/(tabs)/profile';
const SELLER_MENU: Href = '/seller/account';

export function goBackOrReplace(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

/**
 * 直接開起來的頁面（重新整理、通知點進來、分享連結）沒有上一頁可退。
 * 這時返回鍵要落在「這個功能所屬的清單」，而不是一律把人丟回首頁：
 * 賣家的功能頁回賣家「我的」，買家的功能頁回買家「我的」，
 * 詳情頁回它的列表（訂單詳情 → 我的訂單、編輯商品 → 商品管理…）。
 *
 * mode 會影響兩邊共用的頁面（編輯個人資料、聯絡我們、通知中心）：
 * 待在賣家介面時就回賣家「我的」。
 */
export function parentRouteFor(pathname: string, mode: AppMode = 'buyer'): Href {
  const menu: Href = mode === 'seller' ? SELLER_MENU : BUYER_MENU;

  // 兩邊的「我的」本身是分頁落點，往回退就是各自的首頁。
  if (pathname === '/profile' || pathname === '/(tabs)/profile') return '/';
  if (pathname === '/seller/account') return '/seller';

  // 賣家介面
  if (pathname.startsWith('/seller/edit') || pathname === '/seller/new-product') {
    return '/seller/products';
  }
  // 申請成為賣家是從買家「我的」點進來的。
  if (pathname === '/seller/onboarding') return BUYER_MENU;
  if (pathname === '/seller' || pathname.startsWith('/seller/')) return SELLER_MENU;

  // 買家介面的詳情頁 → 回它的列表
  if (pathname.startsWith('/orders/')) return '/orders';
  if (pathname.startsWith('/review')) return '/orders';
  if (pathname.startsWith('/products/')) return '/products';
  if (pathname.startsWith('/messages/')) return '/(tabs)/messages';
  if (pathname === '/checkout') return '/(tabs)/cart';
  if (pathname.startsWith('/store/')) return '/';

  // 只有買家端會用到的功能頁
  if (pathname === '/orders' || pathname === '/favorites' || pathname === '/recently-viewed') {
    return BUYER_MENU;
  }

  // 兩邊共用的功能頁
  if (
    pathname === '/notifications' ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/support') ||
    pathname.startsWith('/legal') ||
    pathname.startsWith('/admin')
  ) {
    return menu;
  }

  return '/';
}
