/**
 * 反垃圾與安全層系統
 *
 * 層 1: 冷卻期 (1 分鐘)
 * 層 2: 重複內容檢查
 * 層 3: 日限額 + 獎勵廣告
 * 層 4: OpenAI gpt-4o-mini 詐騙防護
 *
 * 四層判定全部在 `anti-spam` edge function 裡跑：時間、計數與 OpenAI 金鑰
 * 都不能放在 App 端，否則重裝 App 或改系統時間就能繞過。
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { callAntiSpam } from '@/lib/backend';

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
  const data = await callAntiSpam('cooldown', { userId });

  return {
    allowed: data.allowed,
    reason: data.allowed
      ? undefined
      : '系統提醒：請歇會兒！為了維護平台品質，兩次上架需間隔 1 分鐘。',
    layer: 1,
    nextAllowedAt: data.next_allowed_at ? new Date(data.next_allowed_at) : undefined,
  };
}

/**
 * 層 2: 檢查最近 3 個活躍商品是否有重複標題
 */
export async function checkDuplicateTitle(
  userId: string,
  title: string,
): Promise<AntiSpamCheckResult> {
  const data = await callAntiSpam('duplicate_check', { userId, title });

  return {
    allowed: !data.is_duplicate,
    reason: data.is_duplicate ? '系統提醒：請勿重複發布相同的商品內容！' : undefined,
    layer: 2,
  };
}

/**
 * 層 3: 檢查日限額（10 個免費，11+ 需要看廣告）
 */
export async function checkDailyLimit(userId: string): Promise<AntiSpamCheckResult> {
  const data = await callAntiSpam('daily_limit', { userId });

  return {
    allowed: data.allowed,
    reason: data.allowed
      ? undefined
      : '今日免費上架額度已達 10 件！觀看 1 個 15 秒贊助影片即可免費解鎖今日無限上架額度。',
    layer: 3,
    remainingToday: data.remaining_today,
    watchAdToUnlock: data.watch_ad_to_unlock,
  };
}

/**
 * 層 4: 使用 OpenAI gpt-4o-mini 檢查詐騙或非法內容
 *
 * 成本優化: gpt-4o-mini 用於簡單的二元分類，只回傳危險或安全。
 * 服務失敗時預設放行，不中斷使用者流程，改由人工審核補上。
 */
export async function checkWithAI(
  content: string,
  type: 'message' | 'listing',
): Promise<AntiSpamCheckResult> {
  try {
    const data = await callAntiSpam('ai_check', { content, type });

    return {
      allowed: !data.is_risky,
      reason: data.is_risky
        ? '本平台檢測到您的內容可能涉及詐騙或非法交易。為了保護買家安全，我們無法發布此內容。'
        : undefined,
      layer: 4,
    };
  } catch {
    return { allowed: true, layer: 4 };
  }
}

/**
 * 全面的上架前檢查（層 1-4）
 */
export async function performFullListingCheck(
  userId: string,
  listing: ListingSecurityCheck,
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
  const aiCheck = await checkWithAI(`${listing.title}\n${listing.description ?? ''}`, 'listing');
  if (!aiCheck.allowed) return aiCheck;

  return { allowed: true };
}

/**
 * 訊息只做層 4（AI 詐騙防護）；聊天不套冷卻期與每日額度。
 */
export function performFullMessageCheck(content: string): Promise<AntiSpamCheckResult> {
  return checkWithAI(content, 'message');
}

/**
 * Hook: 監控上架限額
 */
export function useListingRateLimit(userId: string) {
  return useQuery({
    queryKey: ['listing-rate-limit', userId],
    queryFn: () => checkDailyLimit(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 秒快取
  });
}

/**
 * Mutation: 確認上架後更新限額計數
 */
export function useConfirmListing(userId: string) {
  return useMutation({
    mutationFn: () => callAntiSpam('confirm_listing', { userId }),
  });
}

/**
 * Mutation: 選擇看廣告解鎖無限上架額度
 */
export function useUnlockWithAd(userId: string) {
  return useMutation({
    mutationFn: () => callAntiSpam('unlock_with_ad', { userId }),
  });
}
