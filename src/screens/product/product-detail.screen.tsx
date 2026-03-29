import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, Share2, BookOpen } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useProductStore } from '@/store/app.store';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { formatPrice, toSlug } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';
import { productKeys } from '@/hooks/queries/product.queries';
import type { Product } from '@/types/app.type';

import { useProductDetail } from './hooks/useProductDetail';
import { CONDITION_LABEL, cardShadow } from './constants/product-detail.constants';
import { ImageGallery } from './components/image-gallery.component';
import { SpecGrid } from './components/spec-grid.component';
import { ExtraInfoCard } from './components/extra-info-card.component';
import { SellerCard } from './components/seller-card.component';
import { SimilarProducts } from './components/similar-products.component';
import { UnlockBar } from './components/unlock-bar.component';
import { ProductDetailSkeleton } from './components/product-detail-skeleton.component';

type Props = RootStackScreenProps<'ProductDetail'>;

export function ProductDetailScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const queryClient = useQueryClient();
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);
  const isFav = useProductStore((s) => s.isFavorited(productId));
  const requireAuth = useRequireAuth();

  function navigateToProduct(p: Product) {
    if (!queryClient.getQueryData(productKeys.detail(p.id))) {
      queryClient.setQueryData(productKeys.detail(p.id), { data: p });
    }
    navigation.push('ProductDetail', { productId: p.id });
  }

  const {
    product,
    similarProducts,
    specRows,
    unlocked,
    isLoading,
    imageIndex,
    setImageIndex,
    balance,
    handleUnlock,
    handleThumbPress,
    galleryRef,
  } = useProductDetail(productId, navigation);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-secondary">Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  const shortTitle =
    product.title.length > 28 ? `${product.title.slice(0, 28)}…` : product.title;

  const productSlug = product.slug ?? toSlug(product.title);
  const productUrl = `https://modami.vercel.app/explore/${productSlug}`;

  async function handleShare() {
    const conditionLabel = CONDITION_LABEL[product!.condition] ?? product!.condition;
    const priceText = formatPrice(product!.price);
    const brandLine = product!.brand ? `🏷 ${product!.brand}` : '';
    const sizeLine = product!.size ? `📐 Size ${product!.size}` : '';
    const meta = [conditionLabel, brandLine, sizeLine].filter(Boolean).join('  ·  ');

    const message = [
      `✨ ${product!.title}`,
      meta,
      `💰 ${priceText}${product!.isUnlockRequired ? ` (${product!.creditCost} credits để xem liên hệ)` : ''}`,
      '',
      `Xem thêm trên ModaMi 👉 ${productUrl}`,
    ].join('\n');

    await Share.share({ message });
  }

  return (
    <View className="flex-1 bg-background">
      <View
        className="absolute left-0 right-0 flex-row items-center justify-between px-4 z-10"
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-surface/90 items-center justify-center"
          style={cardShadow}
        >
          <ChevronLeft size={22} color={COLORS.onSurface} strokeWidth={2.5} />
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleShare}
            className="w-10 h-10 rounded-full bg-surface/90 items-center justify-center"
            style={cardShadow}
          >
            <Share2 size={18} color={COLORS.onSurface} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => requireAuth(() => toggleFavorite(productId), 'Đăng nhập để lưu sản phẩm yêu thích.')}
            className="w-10 h-10 rounded-full bg-surface/90 items-center justify-center"
            style={cardShadow}
          >
            <Heart
              size={18}
              color={isFav ? '#e84040' : COLORS.onSurface}
              fill={isFav ? '#e84040' : 'none'}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <ImageGallery
          images={product.images}
          imageIndex={imageIndex}
          screenWidth={screenWidth}
          galleryRef={galleryRef}
          onIndexChange={setImageIndex}
          onThumbPress={(idx) => handleThumbPress(idx, screenWidth)}
          isVerified={!!product.isVerified}
          condition={product.condition}
        />

        <View className="px-5 pt-4 gap-4 bg-background">
          <View className="gap-2">
            <Text className="text-[22px] font-bold text-on-surface leading-snug">
              {product.title}
            </Text>
            <Text className="text-2xl font-black text-primary">{formatPrice(product.price)}</Text>
            <View className="flex-row flex-wrap gap-2 mt-1">
              <View className="bg-surface-container rounded-full px-3 py-1">
                <Text className="text-xs font-semibold text-secondary">
                  {CONDITION_LABEL[product.condition] ?? product.condition}
                </Text>
              </View>
              {product.isFeatured && (
                <View className="bg-primary/15 rounded-full px-3 py-1">
                  <Text className="text-xs font-bold text-primary">Nổi bật</Text>
                </View>
              )}
            </View>
          </View>

          <SpecGrid rows={specRows} />

          <ExtraInfoCard
            careInstructions={product.careInstructions}
            shippingNotes={product.shippingNotes}
            authenticityNote={product.authenticityNote}
          />

          {product.description ? (
            <View className="gap-2">
              <Text className="text-sm font-bold text-on-surface uppercase tracking-wide">
                Mô tả
              </Text>
              <Text className="text-sm text-secondary leading-6">{product.description}</Text>
            </View>
          ) : null}

          {product.story ? (
            <View
              className="rounded-2xl border border-primary/25 bg-primary/5 p-4 gap-2"
              style={cardShadow}
            >
              <View className="flex-row items-center gap-2">
                <BookOpen size={18} color={COLORS.primary} strokeWidth={2} />
                <Text className="text-sm font-bold text-primary uppercase tracking-wide">
                  Câu chuyện vật phẩm
                </Text>
              </View>
              <Text className="text-sm text-secondary leading-6">{product.story}</Text>
            </View>
          ) : null}

          <SellerCard
            sellerId={product.sellerId}
            sellerName={product.sellerName}
            sellerRating={product.sellerRating}
            sellerReviewCount={product.sellerReviewCount}
            location={product.location}
            viewCount={product.viewCount}
            likeCount={product.likeCount}
            tags={product.tags}
            unlocked={unlocked}
            onNavigateToSeller={() =>
              navigation.navigate('SellerDetail', { sellerId: product.sellerId })
            }
            onNavigateToConversation={() =>
              requireAuth(
                () => navigation.navigate('Conversation', {
                  conversationId: `conv-${product.sellerId}`,
                  participantName: product.sellerName,
                }),
                'Đăng nhập để nhắn tin với người bán.',
              )
            }
          />

          <SimilarProducts
            products={similarProducts}
            onPress={navigateToProduct}
            onViewAll={() => navigation.navigate('Main', { screen: 'Explore' })}
          />
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-surface px-5 pt-3 border-t border-surface-container"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <UnlockBar
          unlocked={unlocked}
          creditCost={product.creditCost}
          balance={balance}
          sellerName={product.sellerName}
          onUnlock={() => requireAuth(handleUnlock, 'Đăng nhập để mở khoá thông tin người bán.')}
          onMessage={() =>
            requireAuth(
              () => navigation.navigate('Conversation', {
                conversationId: `conv-${product.sellerId}`,
                participantName: product.sellerName,
              }),
              'Đăng nhập để nhắn tin với người bán.',
            )
          }
        />
      </View>
    </View>
  );
}
