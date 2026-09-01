import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Button, SearchField, Typography } from 'heroui-native';
import { router } from 'expo-router';
import {
  Bell,
  ChevronRight,
  LayoutGrid,
  ShoppingCart,
  AlertCircle,
  Sparkles,
} from 'lucide-react-native';

import { AdCarousel } from '@/components/AdCarousel';
import { CategoryIcon } from '@/components/CategoryIcon';
import { HomeQuickLinks } from '@/components/HomeQuickLinks';
import { JihuoLogo, JihuoMark } from '@/components/brand/JihuoLogo';
import { BrandGuard, BrandText } from '@/components/brand/BrandText';
import { LaunchAdModal } from '@/components/LaunchAdModal';
import { ProductCard } from '@/components/ProductCard';
import { ProductRail } from '@/components/ProductRail';
import { RecommendationGrid } from '@/components/RecommendationGrid';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useCategories, useDealProducts } from '@/lib/api/catalog';
import { useAdBanners, useHomeFeed } from '@/lib/api/home';
import { useCartCount } from '@/lib/api/commerce';
import { useMyStoreQuery } from '@/lib/api/seller';
import { useUnreadNotificationCount } from '@/lib/api/social';
import { BRAND, BRAND_COPY } from '@/lib/brand';
import { useGridColumns } from '@/lib/layout';
import { useRecentlyViewedStore } from '@/lib/recentlyViewed';
import { useUserId } from '@/lib/session';
import { HOME_AUTO_SORT } from '@/lib/types';

/**
 * 圖示右上角的數字。整顆泡泡刻意畫在圖示的外側 —— 只要有一部分疊在 22px 的圖示上，
 * 鈴鐺／購物車的線條就會被蓋掉看不清楚。所以泡泡的左下角只碰到圖示的右上角，
 * 尺寸也寫死（15px 高、9px 字）而不是交給 body-xs 的行高。白邊讓泡泡和底色分開。
 *
 * 兩位數以上往左長會壓到圖示，所以改成往右長（用 left 定位），外層的
 * Pressable 是 40x40、圖示只有 22px，右邊還有空間容納。
 */
function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  const label = count > 99 ? '99+' : String(count);
  return (
    <View
      className="bg-brand-orange items-center justify-center"
      pointerEvents="none"
      style={{
        position: 'absolute',
        bottom: 22,
        left: 14,
        height: 15,
        minWidth: 15,
        borderRadius: 8,
        paddingHorizontal: label.length > 1 ? 3 : 0,
        borderWidth: 1.5,
        borderColor: BRAND.white,
      }}
    >
      <Typography
        className="text-white"
        style={{ fontSize: 9, lineHeight: 11, fontWeight: '700', includeFontPadding: false }}
      >
        {label}
      </Typography>
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionLabel = '查看全部',
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between gap-3">
      <View className="flex-1">
        <Typography type="h6" numberOfLines={1} className="text-navy" style={{ fontWeight: '700' }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography type="body-xs" color="muted" numberOfLines={1}>
            {subtitle}
          </Typography>
        ) : null}
      </View>
      {onAction ? (
        <Pressable className="shrink-0 flex-row items-center" hitSlop={6} onPress={onAction}>
          <Typography type="body-sm" className="text-brand-blue">
            {actionLabel}
          </Typography>
          {actionLabel === '查看全部' ? <ChevronRight size={14} color={BRAND.blue} /> : null}
        </Pressable>
      ) : null}
    </View>
  );
}

type Props = {
  /**
   * 開啟時的彈出廣告只屬於買家分頁的首頁：賣家介面裡的市集是主動點進來瀏覽的，
   * 不應該再被廣告攔一次。
   */
  showLaunchAd?: boolean;
};

/**
 * 極貨網市集首頁。
 *
 * 買家分頁的「首頁」與賣家介面的「市集」共用這一份內容 —— 買賣分開的是功能
 * （購物車、訂單、賣家中心），不是可以看到的商品。任何首頁區塊的調整只改這裡。
 */
export function MarketHome({ showLaunchAd = true }: Props) {
  const [query, setQuery] = useState('');
  const userId = useUserId();
  const { data: categories } = useCategories();
  const { data: feed } = useHomeFeed();
  const { data: banners } = useAdBanners();
  const { data: deals } = useDealProducts(6);
  const { data: cartCount } = useCartCount(userId);
  const { data: store } = useMyStoreQuery(userId);
  const { data: unread } = useUnreadNotificationCount(userId);
  const { isFavorite, onToggleFavorite } = useFavoriteToggle();
  const { refreshing, onRefresh } = usePullToRefresh();
  const recentlyViewed = useRecentlyViewedStore((s) => s.ids);
  // 網頁版視窗越寬就越多欄，商品卡（連帶封面圖）才不會被拉大。
  const columns = useGridColumns();

  const submitSearch = () => {
    const term = query.trim();
    router.push(term ? { pathname: '/products', params: { q: term } } : '/products');
  };

  return (
    <View className="bg-background flex-1">
      {/* 固定的頁首只留品牌列與搜尋 —— 手機上再多一塊，商品區就會被推到看不見。 */}
      <View className="bg-surface pt-safe">
        <View className="flex-row items-center px-2 pt-2 pb-1">
          <View className="flex-1 pl-2">
            <JihuoLogo size={34} showEn={false} />
          </View>

          <View className="flex-row items-center">
            <Pressable
              className="h-10 w-10 items-center justify-center"
              hitSlop={6}
              style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}
              onPress={() => router.push('/notifications')}
              accessibilityLabel="通知"
            >
              <View>
                <Bell size={22} color={BRAND.navy} />
                <Badge count={unread ?? 0} />
              </View>
            </Pressable>
            <Pressable
              className="h-10 w-10 items-center justify-center"
              hitSlop={6}
              style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}
              onPress={() => router.push('/cart')}
              accessibilityLabel="購物車"
            >
              <View>
                <ShoppingCart size={22} color={BRAND.navy} />
                <Badge count={cartCount ?? 0} />
              </View>
            </Pressable>
          </View>
        </View>

        <View className="px-4 pt-1 pb-3">
          <BrandGuard texts={[BRAND_COPY.searchPlaceholder]}>
            <SearchField value={query} onChange={setQuery}>
              <SearchField.Group className="rounded-full">
                <SearchField.SearchIcon />
                <SearchField.Input
                  placeholder={BRAND_COPY.searchPlaceholder}
                  returnKeyType="search"
                  onSubmitEditing={submitSearch}
                />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          </BrandGuard>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BRAND.blue}
            colors={[BRAND.blue]}
          />
        }
      >
        {/* 平台提醒橫幅 - 防詐騙警告。跟著內容捲動，不佔固定頁首的高度。 */}
        <View className="mx-4 mt-3 flex-row items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <AlertCircle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <Typography
            type="body-xs"
            className="flex-1 leading-5 text-yellow-900"
            style={{ fontWeight: '500' }}
          >
            平台提醒：本平台完全免費、0%抽成！交易一律直連綠界，請防範私下匯款詐騙。
          </Typography>
        </View>

        <View className="mt-3">
          <HomeQuickLinks />
        </View>

        <View className="px-4 pt-1">
          <LinearGradient
            colors={[BRAND.navy, '#0B3FA8', BRAND.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="relative overflow-hidden rounded-3xl p-5"
          >
            <View className="absolute top-8 -right-5" pointerEvents="none">
              <JihuoMark
                size={150}
                shieldColor="rgba(255,255,255,0.16)"
                accentColor="rgba(255,255,255,0.26)"
                arrowColor="rgba(255,255,255,0.3)"
                letterColor="rgba(255,255,255,0.5)"
              />
            </View>

            <View className="w-[62%]">
              <View className="flex-row items-center gap-1.5">
                <Typography type="h4" className="text-white" style={{ fontWeight: '700' }}>
                  {BRAND_COPY.bannerLeadBuyer}
                </Typography>
                <Typography type="h5" className="text-brand-orange" style={{ fontWeight: '700' }}>
                  ×
                </Typography>
                <Typography type="h4" className="text-white" style={{ fontWeight: '700' }}>
                  {BRAND_COPY.bannerLeadSeller}
                </Typography>
              </View>
              <Typography type="h4" className="text-white" style={{ fontWeight: '700' }}>
                {BRAND_COPY.bannerHeadline}
              </Typography>
              <Button
                className="mt-4 self-start rounded-full bg-white"
                size="sm"
                onPress={() => router.push('/products')}
              >
                <Button.Label className="text-navy" style={{ fontWeight: '700' }}>
                  {BRAND_COPY.bannerCta}
                </Button.Label>
              </Button>
            </View>
          </LinearGradient>
        </View>

        {/* 分類捷徑：左邊一張精選大卡，右邊兩個主分類（圖示配文字橫排，窄螢幕也不會擠），
            第二排三個分類 + 橘色全部分類。圖示放進淺色圓底、字級加大，看起來乾淨一點。 */}
        <View className="mt-4 px-4">
          <View className="flex-row gap-3" style={{ height: 132 }}>
            {/* 左側大瓷磚 - 促銷入口 */}
            <Pressable
              className="bg-brand-blue flex-1 items-start justify-between rounded-3xl p-4"
              accessibilityRole="button"
              accessibilityLabel="精選推薦"
              style={{
                shadowColor: BRAND.blue,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
              onPress={() => router.push('/products')}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Sparkles size={18} color={BRAND.white} />
              </View>
              <View>
                <Typography
                  className="text-white"
                  style={{ fontSize: 16, lineHeight: 21, fontWeight: '700' }}
                >
                  精選推薦
                </Typography>
                <Typography
                  numberOfLines={1}
                  className="text-white/85"
                  style={{ fontSize: 13, lineHeight: 18, fontWeight: '500' }}
                >
                  發現優質商品
                </Typography>
              </View>
            </Pressable>

            {/* 右側兩個主分類 */}
            <View className="flex-1 flex-col gap-3">
              {(categories ?? []).slice(0, 2).map((category) => (
                <Pressable
                  key={category.id}
                  className="bg-surface flex-1 flex-row items-center gap-2.5 rounded-3xl px-3.5"
                  accessibilityRole="button"
                  accessibilityLabel={category.name}
                  style={{
                    shadowColor: BRAND.blue,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                  onPress={() =>
                    router.push({
                      pathname: '/products',
                      params: { categoryId: category.id, categoryName: category.name },
                    })
                  }
                >
                  <View className="bg-brand-blue-soft h-9 w-9 items-center justify-center rounded-full">
                    <CategoryIcon name={category.icon} size={18} color={BRAND.blue} />
                  </View>
                  <Typography
                    numberOfLines={1}
                    className="text-navy flex-1"
                    style={{ fontSize: 15, lineHeight: 20, fontWeight: '600' }}
                  >
                    {category.name}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 第二行: 更多類別 + 全部分類按鈕。固定四欄不換行，橘色按鈕才不會壓到旁邊的分類。 */}
          <View className="mt-3 flex-row gap-2">
            {(categories ?? []).slice(2, 5).map((category) => (
              <Pressable
                key={category.id}
                className="bg-surface flex-1 items-center justify-center rounded-2xl px-1 py-3"
                accessibilityRole="button"
                accessibilityLabel={category.name}
                style={{
                  shadowColor: BRAND.blue,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 1,
                }}
                onPress={() =>
                  router.push({
                    pathname: '/products',
                    params: { categoryId: category.id, categoryName: category.name },
                  })
                }
              >
                <View className="bg-brand-blue-soft h-9 w-9 items-center justify-center rounded-full">
                  <CategoryIcon name={category.icon} size={18} color={BRAND.blue} />
                </View>
                <Typography
                  numberOfLines={1}
                  className="text-navy mt-1.5 text-center"
                  style={{ fontSize: 12, lineHeight: 16, fontWeight: '600' }}
                >
                  {category.name}
                </Typography>
              </Pressable>
            ))}
            {/* 全部分類快捷按鈕 */}
            <Pressable
              className="bg-brand-orange flex-1 items-center justify-center rounded-2xl px-1 py-3"
              accessibilityRole="button"
              accessibilityLabel="全部分類"
              style={{
                shadowColor: BRAND.orange,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 1,
              }}
              onPress={() => router.push('/(tabs)/categories')}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-white/25">
                <LayoutGrid size={18} color={BRAND.white} />
              </View>
              <Typography
                numberOfLines={1}
                className="mt-1.5 text-center text-white"
                style={{ fontSize: 12, lineHeight: 16, fontWeight: '600' }}
              >
                全部分類
              </Typography>
            </Pressable>
          </View>
        </View>

        <AdCarousel banners={banners ?? []} fallbackProducts={deals ?? []} />

        {/* 每一區的標題、順序、是否顯示，以及內容是系統自動或管理員挑選，
            都由後台的「首頁內容」決定；沒有商品的區塊自動隱藏。 */}
        {(feed ?? []).map(({ section, products }) => {
          if (products.length === 0) return null;
          const onAction =
            section.source === 'auto'
              ? () =>
                  router.push({
                    pathname: '/products',
                    params: { sort: HOME_AUTO_SORT[section.auto_kind] },
                  })
              : undefined;

          if (section.layout === 'grid') {
            return (
              <View key={section.key} className="mt-3 px-4">
                <SectionHeader
                  title={section.title}
                  subtitle={section.subtitle || undefined}
                  onAction={onAction}
                />
                <View className="-mx-1.5 flex-row flex-wrap">
                  {products.map((product) => (
                    <View
                      key={product.id}
                      className="mb-3 px-1.5"
                      style={{ width: `${100 / columns}%` }}
                    >
                      <ProductCard
                        product={product}
                        isFavorite={isFavorite(product.id)}
                        onToggleFavorite={onToggleFavorite}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          }

          return (
            <View key={section.key} className="mt-3">
              <View className="px-4">
                <SectionHeader
                  title={section.title}
                  subtitle={section.subtitle || undefined}
                  onAction={onAction}
                />
              </View>
              <ProductRail
                products={products}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
            </View>
          );
        })}

        {/* 個人化推薦：種子是這台裝置最近看過的商品，登入時伺服器再加上購物車與收藏。 */}
        {/* 改為 2 列無限滾動網格，每 4 個產品後自動注入 Google AdMob 原生廣告 */}
        <RecommendationGrid title="為你推薦" seedIds={recentlyViewed} limit={20} adFrequency={4} />

        {/* 已經有店鋪的人不需要這張卡：賣家功能都在賣家介面，從「我的」切換過去。 */}
        {store ? null : (
          <View className="mt-1 px-4">
            <Pressable
              className="bg-surface flex-row items-center gap-3 rounded-2xl p-4"
              onPress={() => router.push('/seller/onboarding')}
            >
              <View className="bg-brand-orange-soft h-11 w-11 items-center justify-center rounded-xl">
                <CategoryIcon name="Package" color={BRAND.orange} />
              </View>
              <View className="flex-1">
                <Typography type="body" className="text-navy" style={{ fontWeight: '600' }}>
                  有東西想賣？
                </Typography>
                <BrandText type="body-sm" color="muted">
                  開一間極貨網店鋪，讓你的商品找到對的人
                </BrandText>
              </View>
              <ChevronRight size={18} color={BRAND.muted} />
            </Pressable>
          </View>
        )}

        <View className="mt-6 items-center gap-1 px-4">
          <Typography type="body-xs" color="muted">
            {BRAND_COPY.core}
          </Typography>
        </View>
      </ScrollView>

      {showLaunchAd ? (
        <LaunchAdModal banners={banners ?? []} fallbackProducts={deals ?? []} />
      ) : null}
    </View>
  );
}
