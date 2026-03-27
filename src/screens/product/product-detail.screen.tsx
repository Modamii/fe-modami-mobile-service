import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
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
  Package,
  Tag,
  Ruler,
  Clock,
} from 'lucide-react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useCreditStore, useProductStore } from '@/store/app.store';
import { mockProducts } from '@/data/mock-products.mock';
import { formatPrice, formatCredits, timeAgo } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';

type Props = RootStackScreenProps<'ProductDetail'>;

const CONDITION_LABEL: Record<string, string> = {
  'new': 'Mới',
  'like-new': 'Như mới',
  'good': 'Tốt',
  'fair': 'Khá tốt',
};

const cardShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  android: { elevation: 2 },
});

export function ProductDetailScreen({ navigation, route }: Props) {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const balance = useCreditStore((s) => s.balance);
  const deductCredit = useCreditStore((s) => s.deductCredit);
  const isUnlocked = useProductStore((s) => s.isUnlocked);
  const unlockProduct = useProductStore((s) => s.unlockProduct);
  const toggleFavorite = useProductStore((s) => s.toggleFavorite);
  const isFav = useProductStore((s) => s.isFavorited(productId));

  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-secondary">Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  const unlocked = !product.isUnlockRequired || isUnlocked(productId);

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

  return (
    <View className="flex-1 bg-background">
      {/* ── Image gallery ── */}
      <View className="relative">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
            setImageIndex(idx);
          }}
          className="bg-surface-container"
          style={{ height: 420 }}
        >
          {product.images.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={{ width: 400, height: 420 }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Gradient overlay at bottom */}
        <View
          className="absolute bottom-0 left-0 right-0 h-20"
          style={{ background: 'transparent' }}
          pointerEvents="none"
        />

        {/* Top controls — back + actions */}
        <View
          className="absolute left-0 right-0 flex-row items-center justify-between px-4"
          style={{ top: insets.top + 8 }}
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

        {/* Image dots */}
        {product.images.length > 1 && (
          <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1.5">
            {product.images.map((_, i) => (
              <View
                key={i}
                className={`h-1.5 rounded-full ${i === imageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </View>
        )}

        {/* Condition badge */}
        <View className="absolute bottom-4 left-4 bg-on-surface/70 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">
            {CONDITION_LABEL[product.condition] ?? product.condition}
          </Text>
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View className="px-5 pt-5 gap-4">
          {/* Title + price */}
          <View className="gap-1">
            <Text className="text-[22px] font-bold text-on-surface leading-snug">{product.title}</Text>
            <View className="flex-row items-center gap-3 mt-1">
              <Text className="text-2xl font-black text-primary">{formatPrice(product.price)}</Text>
              {product.isUnlockRequired && (
                <View className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1">
                  <Lock size={12} color={COLORS.primary} strokeWidth={2.5} />
                  <Text className="text-xs font-bold text-primary">{product.creditCost} credits</Text>
                </View>
              )}
            </View>
          </View>

          {/* Tags row */}
          <View className="flex-row flex-wrap gap-2">
            {product.brand && (
              <View className="flex-row items-center gap-1.5 bg-surface-container rounded-full px-3 py-1.5">
                <Tag size={13} color={COLORS.secondary} strokeWidth={2} />
                <Text className="text-xs font-medium text-secondary">{product.brand}</Text>
              </View>
            )}
            {product.size && (
              <View className="flex-row items-center gap-1.5 bg-surface-container rounded-full px-3 py-1.5">
                <Ruler size={13} color={COLORS.secondary} strokeWidth={2} />
                <Text className="text-xs font-medium text-secondary">Size {product.size}</Text>
              </View>
            )}
            <View className="flex-row items-center gap-1.5 bg-surface-container rounded-full px-3 py-1.5">
              <Package size={13} color={COLORS.secondary} strokeWidth={2} />
              <Text className="text-xs font-medium text-secondary">{product.category}</Text>
            </View>
            {product.location && (
              <View className="flex-row items-center gap-1.5 bg-surface-container rounded-full px-3 py-1.5">
                <MapPin size={13} color={COLORS.secondary} strokeWidth={2} />
                <Text className="text-xs font-medium text-secondary">{product.location}</Text>
              </View>
            )}
            <View className="flex-row items-center gap-1.5 bg-surface-container rounded-full px-3 py-1.5">
              <Clock size={13} color={COLORS.secondary} strokeWidth={2} />
              <Text className="text-xs font-medium text-secondary">{timeAgo(product.createdAt)}</Text>
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View className="bg-surface rounded-2xl p-4 gap-2" style={cardShadow}>
              <Text className="text-sm font-bold text-on-surface">Mô tả</Text>
              <Text className="text-sm text-secondary leading-6">{product.description}</Text>
            </View>
          )}

          {/* Seller info */}
          <View className="bg-surface rounded-2xl p-4 gap-3" style={cardShadow}>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-primary/15 items-center justify-center">
                <Text className="text-lg font-bold text-primary">
                  {product.sellerName.charAt(0)}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-sm font-bold text-on-surface">{product.sellerName}</Text>
                  <ShieldCheck size={14} color={COLORS.primary} strokeWidth={2} />
                </View>
                <Text className="text-xs text-secondary mt-0.5">Người bán uy tín</Text>
              </View>
            </View>

            {/* Contact info — locked or unlocked */}
            {unlocked ? (
              <Animated.View entering={FadeIn.duration(300)} className="gap-2">
                <View className="h-px bg-surface-container" />
                <Text className="text-xs font-semibold text-secondary uppercase tracking-widest">Thông tin liên hệ</Text>
                <TouchableOpacity className="flex-row items-center gap-2 bg-primary/10 rounded-xl px-4 py-3">
                  <Phone size={16} color={COLORS.primary} strokeWidth={2} />
                  <Text className="text-sm font-semibold text-primary">0912 *** ***</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Conversation', {
                    conversationId: `conv-${product.sellerId}`,
                    participantName: product.sellerName,
                  })}
                  className="flex-row items-center gap-2 bg-surface-container rounded-xl px-4 py-3"
                >
                  <MessageCircle size={16} color={COLORS.secondary} strokeWidth={2} />
                  <Text className="text-sm font-semibold text-secondary">Nhắn tin</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View className="gap-2">
                <View className="h-px bg-surface-container" />
                <View className="flex-row items-center gap-2 bg-surface-low rounded-xl px-4 py-3">
                  <Lock size={14} color={COLORS.secondary} strokeWidth={2} />
                  <Text className="text-sm text-secondary">Thông tin bị ẩn</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-surface px-5 pt-3 border-t border-surface-container"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        {unlocked ? (
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1.5 bg-primary/10 rounded-full px-3 py-2">
              <Unlock size={14} color={COLORS.primary} strokeWidth={2.5} />
              <Text className="text-xs font-bold text-primary">Đã mở khóa</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Conversation', {
                conversationId: `conv-${product.sellerId}`,
                participantName: product.sellerName,
              })}
              className="flex-1 bg-primary rounded-[14px] py-4 items-center"
              style={Platform.select({
                ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16 },
                android: { elevation: 4 },
              })}
            >
              <Text className="text-white font-bold text-base">Nhắn tin người bán</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleUnlock}
            className="bg-primary rounded-[14px] py-4 items-center"
            style={Platform.select({
              ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16 },
              android: { elevation: 4 },
            })}
          >
            <Text className="text-white font-bold text-base">
              Xem liên hệ · {product.creditCost} credits
            </Text>
            <Text className="text-white/70 text-xs mt-0.5">Số dư: {formatCredits(balance)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
