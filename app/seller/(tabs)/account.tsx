import type { ReactNode } from 'react';
import { Linking, Platform, Pressable, ScrollView, View } from 'react-native';
import { Avatar, Button, Spinner, Typography } from 'heroui-native';
import { router } from 'expo-router';
import {
  BarChart3,
  ChevronRight,
  Coins,
  LifeBuoy,
  LogOut,
  Megaphone,
  Package,
  Plus,
  Receipt,
  Settings,
  Star,
  Store as StoreIcon,
  Ticket,
  UserCog,
} from 'lucide-react-native';

import { AppImage } from '@/components/AppImage';
import { EmptyState } from '@/components/EmptyState';
import { SellerExitButton } from '@/components/SellerExitButton';
import { SignInRequired } from '@/components/SignInRequired';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useCoinSummary } from '@/lib/api/coins';
import { useMyStoreQuery, useSellerDashboard } from '@/lib/api/seller';
import { protectBrand } from '@/components/brand/BrandText';
import { BRAND } from '@/lib/brand';
import { formatNumber, formatPrice } from '@/lib/format';
import { exitSellerMode } from '@/lib/mode';
import { useSessionStore, useUserId } from '@/lib/session';
import { COIN_NAME } from '@/lib/types';

function MenuRow({
  icon,
  title,
  onPress,
  danger = false,
}: {
  icon: ReactNode;
  title: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable className="flex-row items-center gap-3 px-4 py-3.5" onPress={onPress}>
      <View className="bg-brand-blue-soft h-9 w-9 items-center justify-center rounded-xl">
        {icon}
      </View>
      <Typography type="body" className={danger ? 'text-danger flex-1' : 'text-navy flex-1'}>
        {title}
      </Typography>
      <ChevronRight size={18} color={BRAND.muted} />
    </Pressable>
  );
}

/**
 * 「我的」頁首：返回買家介面的按鈕 + 店鋪資料。店鋪還在載入時也照樣畫出來，
 * 頁首整塊消失只剩轉圈圈會讓人以為畫面壞了。
 */
function AccountHeader({ children }: { children: ReactNode }) {
  return (
    <View className="bg-surface pt-safe px-4 pb-4">
      <View className="pt-2">
        <SellerExitButton />
      </View>
      <View className="mt-2 flex-row items-center gap-3">{children}</View>
    </View>
  );
}

function StoreThumbFallback() {
  return (
    <View
      className="h-14 w-14 items-center justify-center rounded-2xl"
      style={{ backgroundColor: BRAND.blueSoft }}
    >
      <StoreIcon size={24} color={BRAND.blue} />
    </View>
  );
}

/** 賣家介面的「我的」：店鋪、本月營收、上架捷徑、J幣與各項管理入口。 */
export default function SellerAccountScreen() {
  const userId = useUserId();
  const profile = useSessionStore((s) => s.profile);
  const account = useSessionStore((s) => s.account);
  const signOut = useSessionStore((s) => s.signOut);
  const { data: store, isLoading } = useMyStoreQuery(userId);
  const { data: stats, isLoading: statsLoading } = useSellerDashboard(userId, store?.id ?? null);
  const { data: coins } = useCoinSummary(userId);

  if (!userId) {
    return (
      <View className="bg-background pt-safe flex-1">
        <SignInRequired title="登入後進入賣家中心" />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="bg-background flex-1">
        <AccountHeader>
          <StoreThumbFallback />
          <View className="flex-1">
            <Typography type="h5" className="text-navy" style={{ fontWeight: '700' }}>
              賣家中心
            </Typography>
            <Typography type="body-xs" color="muted">
              正在載入店鋪資料…
            </Typography>
          </View>
        </AccountHeader>
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  if (!store) {
    return (
      <View className="bg-background flex-1">
        <EmptyState
          icon={<StoreIcon size={26} color={BRAND.blue} />}
          title="還沒有極貨網店鋪"
          description="建立店鋪後才會有賣家介面。"
          action={
            <Button onPress={() => router.replace('/seller/onboarding')}>
              <Button.Label>申請成為賣家</Button.Label>
            </Button>
          }
        />
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        <AccountHeader>
          {store.logo_url ? (
            <AppImage uri={store.logo_url} className="h-14 w-14 rounded-2xl" />
          ) : (
            <StoreThumbFallback />
          )}
          <View className="flex-1">
            <Typography
              type="h5"
              numberOfLines={1}
              className="text-navy"
              style={{ fontWeight: '700' }}
            >
              {store.name}
            </Typography>
            <Typography type="body-xs" color="muted" numberOfLines={1}>
              評價 {store.rating.toFixed(1)}（{formatNumber(store.rating_count)}）
            </Typography>
          </View>
          <Pressable
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel="店鋪設定"
            onPress={() => router.push('/seller/store')}
          >
            <Settings size={22} color={BRAND.navy} />
          </Pressable>
        </AccountHeader>

        {/* 本月營收：點進去是綠界廠商後台，款項與對帳都在那裡看。 */}
        {!statsLoading && stats ? (
          <Pressable
            className="bg-surface mx-4 mt-3 flex-row items-center justify-between gap-3 rounded-2xl px-4 py-3.5"
            onPress={() => Linking.openURL('https://ecpay.com.tw')}
          >
            <View>
              <Typography type="body-xs" color="muted">
                本月營收
              </Typography>
              <Typography type="h6" className="text-navy" style={{ fontWeight: '700' }}>
                {formatPrice(stats.monthRevenue ?? 0)}
              </Typography>
            </View>
            <View className="items-end">
              <Typography type="body-xs" color="muted">
                商品 / 待處理訂單
              </Typography>
              <Typography type="h6" className="text-navy" style={{ fontWeight: '700' }}>
                {formatNumber(stats.productCount ?? 0)} / {formatNumber(stats.pendingOrders ?? 0)}
              </Typography>
            </View>
          </Pressable>
        ) : null}

        {/* 上架商品是賣家最常做的事，所以獨立成一顆大按鈕。 */}
        <Pressable
          className="mx-4 mt-3 overflow-hidden rounded-2xl"
          accessibilityRole="button"
          accessibilityLabel="新增商品"
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
            ...(Platform.OS === 'web' ? { cursor: 'pointer' } : null),
          })}
          onPress={() => router.push('/seller/new-product')}
        >
          <LinearGradient
            colors={[BRAND.orange, BRAND.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row items-center justify-center gap-2 py-4"
          >
            <Plus size={20} color={BRAND.white} strokeWidth={2.8} />
            <Typography type="body" className="text-white" style={{ fontWeight: '700' }}>
              新增商品
            </Typography>
          </LinearGradient>
        </Pressable>

        <Pressable
          className="bg-surface mx-4 mt-3 flex-row items-center gap-3 rounded-2xl px-4 py-3.5"
          onPress={() => router.push('/seller/coins')}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: BRAND.orangeSoft }}
          >
            <Coins size={19} color={BRAND.orange} />
          </View>
          <View className="flex-1">
            <Typography type="body-xs" color="muted">
              我的{COIN_NAME}
              {coins?.wallet.checkedInToday === false ? ' · 今天還沒簽到' : ''}
            </Typography>
            <Typography type="h6" className="text-navy" style={{ fontWeight: '700' }}>
              {formatNumber(coins?.wallet.balance ?? 0)}
            </Typography>
          </View>
          <Pressable
            className="flex-row items-center"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="賺幣換曝光"
            onPress={() => router.push('/seller/promote')}
          >
            <Typography type="body-sm" className="text-brand-orange" style={{ fontWeight: '600' }}>
              賺幣換曝光
            </Typography>
            <ChevronRight size={16} color={BRAND.orange} />
          </Pressable>
        </Pressable>

        <View className="bg-surface mx-4 mt-3 overflow-hidden rounded-2xl">
          <MenuRow
            icon={<Package size={18} color={BRAND.blue} />}
            title="商品管理"
            onPress={() => router.push('/seller/products')}
          />
          <MenuRow
            icon={<Receipt size={18} color={BRAND.blue} />}
            title="訂單管理"
            onPress={() => router.navigate('/seller/orders')}
          />
          <MenuRow
            icon={<Ticket size={18} color={BRAND.blue} />}
            title="優惠券與折扣碼"
            onPress={() => router.push('/seller/coupons')}
          />
          <MenuRow
            icon={<BarChart3 size={18} color={BRAND.blue} />}
            title="銷售分析"
            onPress={() => router.push('/seller/analytics')}
          />
          <MenuRow
            icon={<Star size={18} color={BRAND.blue} />}
            title="買家評價與回覆"
            onPress={() => router.push('/seller/reviews')}
          />
          <MenuRow
            icon={<Megaphone size={18} color={BRAND.blue} />}
            title="推廣中心"
            onPress={() => router.push('/seller/promote')}
          />
          <MenuRow
            icon={<StoreIcon size={18} color={BRAND.blue} />}
            title="店鋪與出貨設定"
            onPress={() => router.push('/seller/store')}
          />
        </View>

        <View className="bg-surface mx-4 mt-3 overflow-hidden rounded-2xl">
          <View className="flex-row items-center gap-3 px-4 py-3.5">
            <Avatar size="sm" alt={profile?.display_name ?? '會員'}>
              {profile?.avatar_url ? <Avatar.Image source={{ uri: profile.avatar_url }} /> : null}
              <Avatar.Fallback />
            </Avatar>
            <View className="flex-1">
              <Typography
                type="body-sm"
                numberOfLines={1}
                className="text-navy"
                style={{ fontWeight: '600' }}
              >
                {protectBrand(profile?.display_name ?? '極貨網會員')}
              </Typography>
              <Typography type="body-xs" color="muted" numberOfLines={1}>
                {account?.email ?? ''}
              </Typography>
            </View>
          </View>
          <MenuRow
            icon={<UserCog size={18} color={BRAND.blue} />}
            title="編輯個人資料"
            onPress={() => router.push('/profile/edit')}
          />
          <MenuRow
            icon={<LifeBuoy size={18} color={BRAND.blue} />}
            title="聯絡我們"
            onPress={() => router.push('/support/contact')}
          />
          <MenuRow
            icon={<LogOut size={18} color={BRAND.blue} />}
            title="登出"
            danger
            onPress={() => {
              exitSellerMode();
              void signOut();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
