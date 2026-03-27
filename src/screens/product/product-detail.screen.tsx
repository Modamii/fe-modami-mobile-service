import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Lock,
  Unlock,
  ShieldCheck,
  Phone,
  MessageCircle,
  Star,
  Eye,
  BookOpen,
} from 'lucide-react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useCreditStore, useProductStore } from '@/store/app.store';
import { mockProducts } from '@/data/mock-products.mock';
import { formatPrice, formatCredits } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';
import { ProductCard } from '@/components/molecules/product-card.component';
import type { Product } from '@/types/app.type';

type Props = RootStackScreenProps<'ProductDetail'>;

const CONDITION_LABEL: Record<string, string> = {
  new: 'Mới',
  'like-new': 'Như mới',
  good: 'Tốt',
  fair: 'Khá tốt',
};

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

const IMAGE_HEIGHT = 400;
const THUMB_SIZE = 56;

export function ProductDetailScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [imageIndex, setImageIndex] = useState(0);
  const galleryRef = useRef<ScrollView>(null);

  const balance = useCreditStore((s) => s.balance);
  const deductCredit = useCreditStore((s) => s.deductCredit);
  const isUnlocked = useProductStore((s) => s.isUnlocked);
  const unlockProduct = useProductStore((s) => s.unlockProduct);
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);
  const isFav = useProductStore((s) => s.isFavorited(productId));

  const product = mockProducts.find((p) => p.id === productId);

  const similarProducts = useMemo(
    () => mockProducts.filter((p) => p.id !== productId).slice(0, 4),
    [productId],
  );

  const specRows = useMemo(() => {
    if (!product) return [];
    const rows: { label: string; value: string }[] = [];
    if (product.referenceCode) {
      rows.push({ label: 'MÃ SẢN PHẨM', value: product.referenceCode });
    }
    rows.push({ label: 'DANH MỤC', value: product.category });
    rows.push({
      label: 'TÌNH TRẠNG',
      value: CONDITION_LABEL[product.condition] ?? product.condition,
    });
    if (product.gender) rows.push({ label: 'GIỚI TÍNH', value: product.gender });
    if (product.brand) rows.push({ label: 'THƯƠNG HIỆU', value: product.brand });
    if (product.season) rows.push({ label: 'GỢI Ý MÙA', value: product.season });
    if (product.size) rows.push({ label: 'KÍCH CỠ', value: product.size });
    if (product.fit) rows.push({ label: 'DÁNG', value: product.fit });
    if (product.material) rows.push({ label: 'CHẤT LIỆU', value: product.material });
    if (product.color) rows.push({ label: 'MÀU SẮC', value: product.color });
    if (product.year != null) rows.push({ label: 'NĂM', value: String(product.year) });
    if (product.origin) rows.push({ label: 'XUẤT XỨ', value: product.origin });
    if (product.dimensions) {
      rows.push({ label: 'SỐ ĐO / KÍCH THƯỚC', value: product.dimensions });
    }
    return rows;
  }, [product]);

  useEffect(() => {
    setImageIndex(0);
    galleryRef.current?.scrollTo({ x: 0, animated: false });
  }, [productId, screenWidth]);

  if (!product) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-secondary">Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  const unlocked = !product.isUnlockRequired || isUnlocked(productId);

  const handleThumbPress = (index: number) => {
    setImageIndex(index);
    galleryRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  const handleUnlock = () => {
    if (balance < product.creditCost) {
      Alert.alert(
        'Không đủ Credits',
        `Bạn cần ${product.creditCost} credits để xem thông tin này. Số dư hiện tại: ${balance} credits.`,
        [
          { text: 'Huỷ', style: 'cancel' },
          { text: 'Nạp thêm', onPress: () => navigation.navigate('Credits') },
        ],
      );
      return;
    }
    Alert.alert(
      'Xác nhận',
      `Dùng ${product.creditCost} credits để xem thông tin liên hệ người bán?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            deductCredit(product.creditCost);
            unlockProduct(productId);
          },
        },
      ],
    );
  };

  const shortTitle =
    product.title.length > 28 ? `${product.title.slice(0, 28)}…` : product.title;

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
            className="w-10 h-10 rounded-full bg-surface/90 items-center justify-center"
            style={cardShadow}
          >
            <Share2 size={18} color={COLORS.onSurface} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleFavorite(productId)}
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
        <View className="relative bg-surface-container" style={{ height: IMAGE_HEIGHT }}>
          <ScrollView
            ref={galleryRef}
            horizontal
            pagingEnabled
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width,
              );
              setImageIndex(idx);
            }}
            style={{ height: IMAGE_HEIGHT }}
            scrollEventThrottle={16}
          >
            {product.images.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={{ width: screenWidth, height: IMAGE_HEIGHT }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View className="absolute top-4 left-4 flex-row flex-wrap gap-2 z-[1]" pointerEvents="box-none">
            <View className="bg-on-surface/75 px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-bold tracking-wide">
                {CONDITION_LABEL[product.condition]?.toUpperCase() ?? product.condition}
              </Text>
            </View>
            {product.isVerified && (
              <View className="flex-row items-center gap-1 bg-primary/90 px-2.5 py-1 rounded-full">
                <ShieldCheck size={12} color="#fff" strokeWidth={2.5} />
                <Text className="text-white text-[10px] font-semibold">Đã xác thực</Text>
              </View>
            )}
          </View>

          {product.images.length > 1 && (
            <View className="absolute bottom-[72px] left-0 right-0 flex-row justify-center gap-1.5 z-[1]" pointerEvents="none">
              {product.images.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${i === imageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </View>
          )}

          <View className="absolute bottom-0 left-0 right-0 bg-black/25 px-3 py-2 z-[1]">
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="gap-2"
            >
              {product.images.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleThumbPress(i)}
                  className={`rounded-lg overflow-hidden border-2 ${i === imageIndex ? 'border-white' : 'border-transparent'}`}
                >
                  <Image
                    source={{ uri }}
                    style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="px-5 pt-4 gap-4 bg-background">
          <Text className="text-xs text-secondary" numberOfLines={1}>
            Trang chủ / Khám phá / {shortTitle}
          </Text>

          <View className="gap-2">
            <Text className="text-[22px] font-bold text-on-surface leading-snug">{product.title}</Text>
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

          {specRows.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {specRows.map((row) => (
                <View
                  key={row.label}
                  className="w-[48%] grow bg-surface-container rounded-xl p-3"
                >
                  <Text className="text-[10px] font-semibold text-secondary uppercase tracking-wide mb-1">
                    {row.label}
                  </Text>
                  <Text className="text-sm font-semibold text-on-surface leading-5">{row.value}</Text>
                </View>
              ))}
            </View>
          )}

          {(product.careInstructions || product.shippingNotes || product.authenticityNote) && (
            <View className="bg-surface rounded-2xl p-4 gap-4" style={cardShadow}>
              <Text className="text-sm font-bold text-on-surface uppercase tracking-wide">
                Thông tin thêm
              </Text>
              {product.careInstructions ? (
                <View className="gap-1">
                  <Text className="text-xs font-semibold text-primary">Bảo quản & giặt</Text>
                  <Text className="text-sm text-secondary leading-6">{product.careInstructions}</Text>
                </View>
              ) : null}
              {product.shippingNotes ? (
                <View className="gap-1">
                  <Text className="text-xs font-semibold text-primary">Giao hàng</Text>
                  <Text className="text-sm text-secondary leading-6">{product.shippingNotes}</Text>
                </View>
              ) : null}
              {product.authenticityNote ? (
                <View className="gap-1">
                  <Text className="text-xs font-semibold text-primary">Nguồn gốc & chứng thực</Text>
                  <Text className="text-sm text-secondary leading-6">{product.authenticityNote}</Text>
                </View>
              ) : null}
            </View>
          )}

          {product.description ? (
            <View className="gap-2">
              <Text className="text-sm font-bold text-on-surface uppercase tracking-wide">Mô tả</Text>
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

          <View className="bg-surface rounded-2xl p-4 gap-3" style={cardShadow}>
            <View className="flex-row items-start justify-between gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('SellerDetail', { sellerId: product.sellerId })}
                className="flex-row items-center gap-3 flex-1"
                accessibilityRole="button"
                accessibilityLabel={`Xem cửa hàng ${product.sellerName}`}
              >
                <View className="w-12 h-12 rounded-full bg-primary/15 items-center justify-center">
                  <Text className="text-lg font-bold text-primary">{product.sellerName.charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-on-surface">{product.sellerName}</Text>
                  {product.sellerRating != null && product.sellerReviewCount != null ? (
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <Star size={14} color="#d4af37" fill="#d4af37" strokeWidth={0} />
                      <Text className="text-sm text-secondary">
                        {product.sellerRating} ({product.sellerReviewCount} đánh giá)
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <ShieldCheck size={14} color={COLORS.primary} strokeWidth={2} />
                      <Text className="text-xs text-secondary">Người bán uy tín</Text>
                    </View>
                  )}
                  <Text className="text-xs font-semibold text-primary mt-1">Xem cửa hàng →</Text>
                </View>
              </TouchableOpacity>
              {product.location ? (
                <View className="flex-row items-center gap-1">
                  <MapPin size={14} color={COLORS.secondary} strokeWidth={2} />
                  <Text className="text-xs text-secondary">{product.location}</Text>
                </View>
              ) : null}
            </View>

            {(product.viewCount != null || product.likeCount != null) && (
              <View className="flex-row items-center gap-6 pt-2 border-t border-surface-container">
                {product.viewCount != null && (
                  <View className="flex-row items-center gap-1.5">
                    <Eye size={16} color={COLORS.secondary} strokeWidth={2} />
                    <Text className="text-sm text-secondary">{product.viewCount} lượt xem</Text>
                  </View>
                )}
                {product.likeCount != null && (
                  <View className="flex-row items-center gap-1.5">
                    <Heart size={16} color={COLORS.secondary} strokeWidth={2} />
                    <Text className="text-sm text-secondary">{product.likeCount} yêu thích</Text>
                  </View>
                )}
              </View>
            )}

            {product.tags && product.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <View key={tag} className="bg-surface-container rounded-full px-3 py-1">
                    <Text className="text-xs text-secondary">#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {unlocked ? (
              <Animated.View entering={FadeIn.duration(300)} className="gap-2 pt-2 border-t border-surface-container">
                <Text className="text-xs font-semibold text-secondary uppercase tracking-widest">
                  Thông tin liên hệ
                </Text>
                <TouchableOpacity className="flex-row items-center gap-2 bg-primary/10 rounded-xl px-4 py-3">
                  <Phone size={16} color={COLORS.primary} strokeWidth={2} />
                  <Text className="text-sm font-semibold text-primary">0912 *** ***</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Conversation', {
                      conversationId: `conv-${product.sellerId}`,
                      participantName: product.sellerName,
                    })
                  }
                  className="flex-row items-center gap-2 bg-surface-container rounded-xl px-4 py-3"
                >
                  <MessageCircle size={16} color={COLORS.secondary} strokeWidth={2} />
                  <Text className="text-sm font-semibold text-secondary">Nhắn tin</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View className="gap-2 pt-2 border-t border-surface-container">
                <View className="flex-row items-center gap-2 bg-surface-container rounded-xl px-4 py-3">
                  <Lock size={14} color={COLORS.secondary} strokeWidth={2} />
                  <Text className="text-sm text-secondary">Thông tin liên hệ bị ẩn — mở khóa để xem</Text>
                </View>
              </View>
            )}
          </View>

          {similarProducts.length > 0 && (
            <View className="pb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-on-surface">Sản phẩm tương tự</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Main', { screen: 'Explore' })}
                  hitSlop={8}
                >
                  <Text className="text-sm font-semibold text-primary">Xem tất cả →</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
                {similarProducts.map((p) => (
                  <View key={p.id} className="w-[160px]">
                    <ProductCard
                      product={p}
                      onPress={(item: Product) =>
                        navigation.replace('ProductDetail', { productId: item.id })
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-surface px-5 pt-3 border-t border-surface-container"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        {unlocked ? (
          <View className="flex-row items-center gap-2">
            <View
              accessibilityLabel="Đã mở khóa thông tin liên hệ"
              accessibilityRole="image"
              className="h-14 w-14 shrink-0 rounded-[14px] bg-primary/10 items-center justify-center"
            >
              <Unlock size={22} color={COLORS.primary} strokeWidth={2.5} />
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Conversation', {
                  conversationId: `conv-${product.sellerId}`,
                  participantName: product.sellerName,
                })
              }
              className="flex-1 h-14 justify-center items-center rounded-[14px] bg-primary px-3"
              style={Platform.select({
                ios: {
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.28,
                  shadowRadius: 16,
                },
                android: { elevation: 4 },
              })}
            >
              <Text className="text-white font-bold text-base" numberOfLines={1}>
                Nhắn tin người bán
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleUnlock}
            className="bg-primary rounded-[14px] py-4 px-4 flex-row items-center justify-center gap-2"
            style={Platform.select({
              ios: {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.28,
                shadowRadius: 16,
              },
              android: { elevation: 4 },
            })}
          >
            <Lock size={18} color="#fff" strokeWidth={2.5} />
            <View className="flex-1 items-center">
              <Text className="text-white font-bold text-base">
                Mở khóa thông tin liên hệ | {product.creditCost} CREDIT
              </Text>
              <Text className="text-white/75 text-xs mt-0.5">Số dư: {formatCredits(balance)}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
