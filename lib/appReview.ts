/**
 * App Store 評分觸發器
 * 
 * 觸發條件：
 * 1. 新賣家成功發布第 3 件商品
 * 2. 用戶發送總共 5 條聊天消息
 */

import { useCallback } from 'react';
import * as StoreReview from 'expo-store-review';
import { useBrandToast } from '@/components/brand/BrandToast';

export type AppReviewTriggerType = 'seller_3rd_product' | 'buyer_5_messages';

interface AppReviewConfig {
  isAvailable: boolean;
  isRequested: boolean;
}

const REVIEW_STORAGE_KEY = 'app-review-requested';

/**
 * 檢查是否已經要求過評分
 */
async function isReviewAlreadyRequested(): Promise<boolean> {
  try {
    const value = await globalThis.localStorage?.getItem(REVIEW_STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

/**
 * 記錄已請求評分
 */
async function markReviewAsRequested(): Promise<void> {
  try {
    await globalThis.localStorage?.setItem(REVIEW_STORAGE_KEY, 'true');
  } catch {
    // 忽略儲存錯誤
  }
}

/**
 * 觸發應用程式商店評分彈出窗口
 */
export async function triggerAppReview(triggerType: AppReviewTriggerType): Promise<void> {
  const alreadyRequested = await isReviewAlreadyRequested();

  if (alreadyRequested) {
    console.log('App review already requested before');
    return;
  }

  const isAvailable = await StoreReview.isAvailableAsync();

  if (!isAvailable) {
    console.log('App Store review is not available on this platform');
    return;
  }

  try {
    console.log(`Requesting app review (triggered by: ${triggerType})`);
    await StoreReview.requestReview();
    await markReviewAsRequested();
  } catch (error) {
    console.error('Error requesting app review:', error);
  }
}

/**
 * Hook: 在特定事件後自動觸發評分請求
 */
export function useAppReviewTrigger() {
  const { toast } = useBrandToast();

  return useCallback((triggerType: AppReviewTriggerType) => {
    // 非同步觸發，不阻塞 UI
    triggerAppReview(triggerType).catch((error) => {
      console.error('Failed to trigger app review:', error);
    });

    // 向用戶顯示可選的評分提示
    if (triggerType === 'seller_3rd_product') {
      toast.show({
        variant: 'success',
        label: '🎉 喜歡完全免費、0% 抽成的極貨網嗎？點擊下方按鈕在商店留下 5 星好評，這就是對我們最大的支持！',
      });
    } else if (triggerType === 'buyer_5_messages') {
      toast.show({
        variant: 'success',
        label: '🎉 感謝您使用極貨網！若您滿意我們的服務，請在商店留下 5 星好評。',
      });
    }
  }, [toast]);
}

/**
 * 檢查並觸發賣家第 3 件商品的評分
 */
export function checkAndTriggerSellerReview(publishedProductCount: number): void {
  if (publishedProductCount === 3) {
    triggerAppReview('seller_3rd_product');
  }
}

/**
 * 檢查並觸發買家 5 條消息的評分
 */
export function checkAndTriggerBuyerReview(totalMessagesSent: number): void {
  if (totalMessagesSent === 5) {
    triggerAppReview('buyer_5_messages');
  }
}
