import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MapPin,
  Clock,
  Package,
  Star,
  MessageCircle,
  UserPlus,
  UserCheck,
} from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { ProductCard } from '@/components/molecules/product-card.component';
import { productKeys } from '@/hooks/queries/product.queries';
import { useSeller, useSellerProducts } from '@/hooks/queries/seller.queries';
import { COLORS } from '@/constants/app.constants';
import type { Product } from '@/types/app.type';
import { ReviewCard } from './components/review-card.component';

type Props = RootStackScreenProps<'SellerDetail'>;

const COVER_HEIGHT = 176;
const GRID_GAP = 12;
const GRID_COLS = 2;

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

export function SellerDetailScreen({ navigation, route }: Readonly<Props>) {
  const { sellerId } = route.params;
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [gridRowWidth, setGridRowWidth] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const {
    data: sellerData,
    isLoading: isSellerLoading,
    isFetching: isSellerFetching,
    error: sellerError,
    refetch: refetchSeller,
  } = useSeller(sellerId);

  const {
    data: sellerProductsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    error: productsError,
    refetch: refetchProducts,
  } = useSellerProducts(sellerId);

  const seller = sellerData?.data ?? null;
  const products = sellerProductsData?.data ?? [];
  const isInitialLoading = (isSellerLoading || isProductsLoading) && !seller;

  const columnWidth = useMemo(() => {
    const available =
      gridRowWidth > 0 ? gridRowWidth : Math.max(0, windowWidth - 40);
    return (available - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
  }, [gridRowWidth, windowWidth]);

  const handleProductPress = (p: Product) => {
    queryClient.setQueryData(productKeys.detail(p.id), { data: p, success: true });
    navigation.navigate('ProductDetail', { productId: p.id });
  };

  if (isInitialLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6 gap-2">
        <Text className="text-on-surface text-base font-semibold text-center">
          Đang tải thông tin người bán...
        </Text>
        <Text className="text-secondary text-center">Vui lòng chờ trong giây lát.</Text>
      </View>
    );
  }

  if ((sellerError || productsError) && !seller) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6 gap-3">
        <Text className="text-on-surface text-base font-semibold text-center">
          Không thể tải dữ liệu người bán
        </Text>
        <Text className="text-secondary text-center">
          Vui lòng kiểm tra kết nối và thử lại.
        </Text>
        <TouchableOpacity
          onPress={() => {
            void refetchSeller();
            void refetchProducts();
          }}
          className="bg-primary rounded-xl px-4 py-3"
          accessibilityRole="button"
          accessibilityLabel="Thử lại"
        >
          <Text className="text-on-primary font-semibold">Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-primary font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!seller) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-secondary text-center">Không tìm thấy người bán</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
          <Text className="text-primary font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View
        className="absolute left-0 right-0 flex-row items-center z-20 px-4"
        style={{ top: insets.top + 8 }}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-surface/95 items-center justify-center"
          style={cardShadow}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeft size={22} color={COLORS.onSurface} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="relative">
          <Image
            source={{ uri: seller.coverImageUrl }}
            className="w-full"
            style={{ height: COVER_HEIGHT }}
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-on-surface/20" />
        </View>

        <View className="px-4 -mt-14 z-10">
          <View className="bg-surface rounded-3xl p-4 gap-4" style={cardShadow}>
            <View className="flex-row items-start gap-3">
              {seller.avatarUrl ? (
                <Image
                  source={{ uri: seller.avatarUrl }}
                  className="w-[72px] h-[72px] rounded-2xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-[72px] h-[72px] rounded-2xl bg-primary/15 items-center justify-center">
                  <Text className="text-2xl font-bold text-primary">
                    {seller.displayName.charAt(0)}
                  </Text>
                </View>
              )}
              <View className="flex-1 min-w-0 gap-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="text-lg font-bold text-on-surface shrink" numberOfLines={1}>
                    {seller.displayName}
                  </Text>
                  {seller.isVerified ? (
                    <View className="bg-primary/12 rounded-full px-2 py-0.5">
                      <Text className="text-[10px] font-bold text-primary uppercase tracking-wide">
                        Uy tín
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text className="text-sm text-secondary">{seller.username}</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Star size={14} color="#d4af37" fill="#d4af37" strokeWidth={0} />
                  <Text className="text-sm text-secondary">
                    {seller.rating} ({seller.reviewCount} đánh giá)
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setIsFollowing((v) => !v)}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
                  isFollowing ? 'bg-primary/15' : 'bg-primary'
                }`}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
              >
                {isFollowing ? (
                  <UserCheck size={18} color={COLORS.primary} strokeWidth={2.2} />
                ) : (
                  <UserPlus size={18} color={COLORS.onPrimary} strokeWidth={2.2} />
                )}
                <Text
                  className={`text-sm font-semibold ${isFollowing ? 'text-primary' : 'text-on-primary'}`}
                >
                  {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Conversation', {
                    conversationId: `conv-${seller.id}`,
                    participantName: seller.displayName,
                  })
                }
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface py-3"
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Nhắn tin"
              >
                <MessageCircle size={18} color={COLORS.secondary} strokeWidth={2.2} />
                <Text className="text-sm font-semibold text-on-surface">Nhắn tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-4 pt-6 gap-6">
          {(isSellerFetching || isProductsFetching) && (
            <Text className="text-xs text-secondary">Đang cập nhật dữ liệu mới nhất...</Text>
          )}

          <View className="bg-surface-container rounded-3xl p-4 gap-3">
            <Text className="text-xs font-bold text-on-surface uppercase tracking-widest">
              Giới thiệu
            </Text>
            <Text className="text-sm text-secondary leading-6">{seller.bio}</Text>
            <View className="gap-3 pt-1">
              <View className="flex-row items-start gap-2">
                <MapPin size={18} color={COLORS.secondary} strokeWidth={2} />
                <Text className="text-sm text-secondary flex-1">{seller.location}</Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Clock size={18} color={COLORS.secondary} strokeWidth={2} />
                <Text className="text-sm text-secondary flex-1">{seller.joinedAtLabel}</Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Package size={18} color={COLORS.secondary} strokeWidth={2} />
                <Text className="text-sm text-secondary flex-1">
                  {seller.soldCount} sản phẩm đã bán
                </Text>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-base font-bold text-on-surface mb-3">
              Sản phẩm đang bán ({products.length})
            </Text>
            {products.length === 0 ? (
              <Text className="text-sm text-secondary">Chưa có sản phẩm hiển thị.</Text>
            ) : (
              <View
                className="flex-row flex-wrap w-full"
                style={{ gap: GRID_GAP }}
                onLayout={(e) => setGridRowWidth(e.nativeEvent.layout.width)}
              >
                {products.map((product) => (
                  <View key={product.id} style={{ width: columnWidth }}>
                    <ProductCard product={product} onPress={handleProductPress} />
                  </View>
                ))}
              </View>
            )}
          </View>

          <View>
            <Text className="text-base font-bold text-on-surface mb-3">
              Đánh giá từ khách hàng
            </Text>
            <View className="gap-3">
              {seller.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
