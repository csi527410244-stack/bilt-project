import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { Spinner, Typography } from 'heroui-native';
import { Sparkles } from 'lucide-react-native';

import { ProductCard } from '@/components/ProductCard';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { useForYouProducts, useSimilarProducts } from '@/lib/api/recommend';
import { BRAND } from '@/lib/brand';
import type { ProductListItem } from '@/lib/types';

type Props = {
  /** 區塊標題，例如「為你推薦」。 */
  title: string;
  /** 帶 productId = 商品頁的相似推薦；不帶就用 seedIds 做個人化推薦。 */
  productId?: string;
  /** 個人化推薦的種子（最近瀏覽、購物車內容），最多取前 8 筆。 */
  seedIds?: string[];
  limit?: number;
  /** 每行 2 列，每 4 個產品後注入廣告 */
  adFrequency?: number;
};

type GridItem =
  | { type: 'product'; product: ProductListItem }
  | { type: 'ad'; adId: string }
  | { type: 'header' };

/**
 * 2 列無限滾動推薦網格。每 4 個產品後自動注入 Google AdMob 原生廣告位置。
 */
export function RecommendationGrid({
  title,
  productId,
  seedIds,
  limit = 10,
  adFrequency = 4,
}: Props) {
  const { isFavorite, onToggleFavorite } = useFavoriteToggle();
  const similar = useSimilarProducts(productId, limit);
  const forYou = useForYouProducts(seedIds ?? [], limit, !productId);

  const query = productId ? similar : forYou;
  const products = useMemo(() => query.data?.products ?? [], [query.data]);
  const reason = query.data?.reason ?? '';

  // 將產品和廣告混合在一個平坦列表中，每 4 個產品後插入廣告
  const gridData: GridItem[] = useMemo(() => {
    if (products.length === 0) return [];

    const data: GridItem[] = [{ type: 'header' }];
    products.forEach((product, index) => {
      data.push({ type: 'product', product });
      // 每 adFrequency 個產品後（且不是最後一個），插入廣告
      if ((index + 1) % adFrequency === 0 && index + 1 < products.length) {
        data.push({ type: 'ad', adId: `ad-${Math.floor(index / adFrequency)}` });
      }
    });
    return data;
  }, [products, adFrequency]);

  if (query.isLoading) {
    return (
      <View className="mt-3 items-center py-6">
        <Spinner size="sm" />
      </View>
    );
  }

  if (products.length === 0) return null;

  return (
    <View className="mt-3 px-4">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="bg-brand-blue-soft h-7 w-7 items-center justify-center rounded-full">
          <Sparkles size={15} color={BRAND.blue} />
        </View>
        <View className="flex-1">
          <Typography
            type="h6"
            numberOfLines={1}
            className="text-navy"
            style={{ fontWeight: '700' }}
          >
            {title}
          </Typography>
          {reason ? (
            <Typography type="body-xs" color="muted" numberOfLines={1}>
              {reason}
            </Typography>
          ) : null}
        </View>
      </View>

      <FlatList
        data={gridData}
        numColumns={2}
        keyExtractor={(item) => {
          if (item.type === 'header') return 'header';
          if (item.type === 'ad') return item.adId;
          return item.product.id;
        }}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return null; // 標題在網格外部呈現
          }

          if (item.type === 'ad') {
            // AdMob 原生廣告位置 - 佔據 2 列寬度
            return (
              <View
                style={{ width: '100%', height: 240, marginHorizontal: 0 }}
                className="bg-surface mb-3 items-center justify-center rounded-2xl"
              >
                <Typography type="body-xs" color="muted">
                  Google AdMob 廣告
                </Typography>
                {/*
                  實際的 Google AdMob Native Ad 會在這裡渲染
                  TODO: 集成 react-native-google-mobile-ads
                  <GoogleMobileAdsNativeAd adUnitID="ca-app-pub-xxxxx" />
                */}
              </View>
            );
          }

          return (
            <View style={{ flex: 1 }}>
              <ProductCard
                product={item.product}
                isFavorite={isFavorite(item.product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
