/**
 * 賣家錢包儀表板
 * 
 * 特性：
 * - 展示已節省手續費（根據銷售額自動計算）
 * - 顯示獲得的 J 幣獎勵
 * - 可提現金額
 */

import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { Typography } from 'heroui-native';
import { router } from 'expo-router';
import { TrendingUp, Coins, Wallet } from 'lucide-react-native';
import { BRAND } from '@/lib/brand';
import { formatPrice } from '@/lib/format';
import type { Order } from '@/lib/types';

type Props = {
  orders: Order[];
  coins: number;
  withdrawableAmount: number;
};

/**
 * 賣家錢包英雄卡片
 */
export function SellerWalletHeroCard({
  orders,
  coins,
  withdrawableAmount,
}: Props) {
  // 計算已節省的手續費 (10% 的已完成訂單總額)
  const savedFees = useMemo(() => {
    const completedTotal = orders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + (order.total ?? 0), 0);
    return Math.floor(completedTotal * 0.1);
  }, [orders]);

  const heroAmount = withdrawableAmount || savedFees || 0;

  return (
    <Pressable
      className="mx-4 overflow-hidden rounded-3xl p-6"
      style={{
        background: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.navy} 100%)`,
        minHeight: 200,
      }}
      onPress={() => router.push('/seller/coins')}
    >
      <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

      <View className="relative z-10">
        <View className="mb-6 flex-row items-center gap-2">
          <TrendingUp size={20} color={BRAND.white} />
          <Typography
            type="body-sm"
            className="text-white"
            style={{ fontWeight: '600' }}
          >
            你已節省的手續費
          </Typography>
        </View>

        <Typography
          type="h3"
          className="text-white"
          style={{ fontWeight: '700' }}
        >
          💰 {formatPrice(heroAmount)}
        </Typography>

        <Typography
          type="body-sm"
          className="mt-1 text-white/80"
          numberOfLines={2}
        >
          極貨網已累計幫您省下 NT${heroAmount} 的手續費抽成！
        </Typography>

        {/* 統計卡片 */}
        <View className="mt-6 flex-row gap-3">
          <View className="flex-1 rounded-xl bg-white/15 p-3">
            <View className="mb-2 flex-row items-center gap-1">
              <Coins size={14} color={BRAND.white} />
              <Typography
                type="body-xs"
                className="text-white/70"
                style={{ fontWeight: '500' }}
              >
                J幣
              </Typography>
            </View>
            <Typography
              type="h6"
              className="text-white"
              style={{ fontWeight: '700' }}
            >
              {coins}
            </Typography>
          </View>

          <View className="flex-1 rounded-xl bg-white/15 p-3">
            <View className="mb-2 flex-row items-center gap-1">
              <Wallet size={14} color={BRAND.white} />
              <Typography
                type="body-xs"
                className="text-white/70"
                style={{ fontWeight: '500' }}
              >
                可提現
              </Typography>
            </View>
            <Typography
              type="h6"
              className="text-white"
              style={{ fontWeight: '700' }}
            >
              ${withdrawableAmount}
            </Typography>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * 簡化版錢包統計卡片
 */
export function SellerWalletStatCard({
  label,
  value,
  icon: Icon,
  subtext,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtext?: string;
}) {
  return (
    <View
      className="flex-1 rounded-2xl bg-gradient-to-br px-4 py-4"
      style={{ backgroundColor: BRAND.blueSoft }}
    >
      <View className="mb-2 flex-row items-center justify-between">
        <Typography
          type="body-xs"
          color="muted"
          style={{ fontWeight: '600' }}
        >
          {label}
        </Typography>
        {Icon}
      </View>
      <Typography
        type="h5"
        className="text-brand-blue"
        style={{ fontWeight: '700' }}
      >
        {value}
      </Typography>
      {subtext ? (
        <Typography type="body-xs" color="muted" className="mt-1">
          {subtext}
        </Typography>
      ) : null}
    </View>
  );
}
