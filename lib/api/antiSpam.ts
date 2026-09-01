/**
 * 反垃圾郵件和安全層系統
 * 
 * 層 1: 冷卻期 (1 分鐘)
 * 層 2: 重複內容檢查
 * 層 3: 日限額 + 獎勵廣告
 * 層 4: OpenAI gpt-4o-mini 詐騙防護
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { BACKEND } from '@/lib/backend';

export type AntiSpamCheckResult = {
  allowed: boolean;
  reason?: string;
  layer?: 1 | 2 | 3 | 4;
  nextAllowedAt?: Date; // 層 1 - 下次允許時間
  remainingToday?: number; // 層 3 - 今天還剩多少免費額度
  watchAdToUnlock?: boolean; // 層 3 - 是否需要看廣告解鎖
};

export type ListingSecurityCheck = {
  title: string;
  description?: string;
  categoryId: string;
};

export type MessageSecurityCheck = {
  content: string;
  conversationId: string;
};

/**
 * 層 1: 檢查 1 分鐘冷卻期
 */
export async function checkCooldown(userId: string): Promise<AntiSpamCheckResult> {
  const response = await BACKEND.http.get(`/anti-spam/cooldown/${userId}`);
  const data = response.json() as { allowed: boolean; nextAllowedAt?: string };

  return {
    allowed: data.allowed,
    reason: !data.allowed
      ? '系統提醒：請歇會兒！為了維護平台品質，兩次上架需間隔 1 分鐘。'
      : undefined,
    layer: 1,
    nextAllowedAt: data.nextAllowedAt ? new Date(data.nextAllowedAt) : undefined,
  };
}

/**
 * 層 2: 檢查最近 3 個活躍商品是否有重複標題
 */
export async function checkDuplicateTitle(
  userId: string,
  title: string
): Promise<AntiSpamCheckResult> {
  const response = await BACKEND.http.post(`/anti-spam/duplicate-check`, {
    userId,
    title,
  });
  const data = response.json() as { isDuplicate: boolean };

  return {
    allowed: !data.isDuplicate,
    reason: data.isDuplicate
      ? '系統提醒：請勿重複發布相同的商品內容！'
      : undefined,
    layer: 2,
  };
}

/**
 * 層 3: 檢查日限額（10 個免費，11+ 需要看廣告）
 */
export async function checkDailyLimit(userId: string): Promise<AntiSpamCheckResult> {
  const response = await BACKEND.http.get(`/anti-spam/daily-limit/${userId}`);
  const data = response.json() as {
    allowed: boolean;
    remainingToday: number;
    watchAdToUnlock?: boolean;
  };

  return {
    allowed: data.allowed,
    reason: !data.allowed
      ? '💡 今日免費上架額度已達 10 件！觀看 1 個 15 秒贊助影片即可免費解鎖今日無限上架額度！'
      : undefined,
    layer: 3,
    remainingToday: data.remainingToday,
    watchAdToUnlock: data.watchAdToUnlock ?? false,
  };
}

/**
 * 層 4: 使用 OpenAI gpt-4o-mini 檢查詐騙或非法內容
 * 
 * 成本優化: gpt-4o-mini 是 GPT-4 的超輕量版本，用於簡單的二進制分類。
 * 只返回 '1'（危險）或 '0'（安全）。
 */
export async function checkWithAI(
  content: string,
  type: 'message' | 'listing'
): Promise<AntiSpamCheckResult> {
  try {
    const response = await BACKEND.http.post(`/anti-spam/ai-check`, {
      content,
      type,
    });
    const data = response.json() as { isRisky: boolean };

    return {
      allowed: !data.isRisky,
      reason: data.isRisky
        ? '本平台檢測到您的內容可能涉及詐騙或非法交易。為了保護買家安全，我們無法發布此內容。'
        : undefined,
      layer: 4,
    };
  } catch (error) {
    console.error('AI security check failed:', error);
    // 失敗時默認允許（不中斷用戶體驗），但記錄日誌供人工審查
    return {
      allowed: true,
      layer: 4,
    };
  }
}

/**
 * 全面的上架前檢查（層 1-4）
 */
export async function performFullListingCheck(
  userId: string,
  listing: ListingSecurityCheck
): Promise<AntiSpamCheckResult> {
  // 層 1: 冷卻期
  const cooldownCheck = await checkCooldown(userId);
  if (!cooldownCheck.allowed) return cooldownCheck;

  // 層 2: 重複檢查
  const duplicateCheck = await checkDuplicateTitle(userId, listing.title);
  if (!duplicateCheck.allowed) return duplicateCheck;

  // 層 3: 日限額
  const limitCheck = await checkDailyLimit(userId);
  if (!limitCheck.allowed) return limitCheck;

  // 層 4: AI 詐騙防護
  const aiCheck = await checkWithAI(
    `${listing.title}\n${listing.description || ''}`,
    'listing'
  );
  if (!aiCheck.allowed) return aiCheck;

  return { allowed: true };
}

/**
 * 全面的消息前檢查（層 1、4）
 */
export async function performFullMessageCheck(
  content: string,
  conversationId: string
): Promise<AntiSpamCheckResult> {
  // 對消息只執行層 4: AI 詐騙防護
  const aiCheck = await checkWithAI(content, 'message');
  return aiCheck;
}

/**
 * Hook: 監控上架限額
 */
export function useListingRateLimit(userId: string) {
  return useQuery({
    queryKey: ['listing-rate-limit', userId],
    queryFn: () => checkDailyLimit(userId),
    staleTime: 30 * 1000, // 30 秒快取
  });
}

/**
 * Mutation: 確認上架後更新限額計數
 */
export function useConfirmListing(userId: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await BACKEND.http.post(`/anti-spam/confirm-listing/${userId}`, {});
      return response.json();
    },
  });
}

/**
 * Mutation: 選擇看廣告解鎖無限上架額度
 */
export function useUnlockWithAd(userId: string) {
  return useMutation({
    mutationFn: async () => {
      const response = await BACKEND.http.post(`/anti-spam/unlock-with-ad/${userId}`, {});
      return response.json();
    },
  });
}
