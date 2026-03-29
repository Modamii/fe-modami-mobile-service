import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  MapPin,
  Lock,
  ShieldCheck,
  Phone,
  MessageCircle,
  Star,
  Eye,
  Heart,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app.constants';
import { cardShadow } from '../constants/product-detail.constants';

type Props = Readonly<{
  sellerId: string;
  sellerName: string;
  sellerRating?: number;
  sellerReviewCount?: number;
  location?: string;
  viewCount?: number;
  likeCount?: number;
  tags?: string[];
  unlocked: boolean;
  onNavigateToSeller: () => void;
  onNavigateToConversation: () => void;
}>;

export function SellerCard({
  sellerId,
  sellerName,
  sellerRating,
  sellerReviewCount,
  location,
  viewCount,
  likeCount,
  tags,
  unlocked,
  onNavigateToSeller,
  onNavigateToConversation,
}: Props) {
  return (
    <View className="bg-surface rounded-2xl p-4 gap-3" style={cardShadow}>
      <View className="flex-row items-start justify-between gap-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onNavigateToSeller}
          className="flex-row items-center gap-3 flex-1"
          accessibilityRole="button"
          accessibilityLabel={`Xem cửa hàng ${sellerName}`}
        >
          <View className="w-12 h-12 rounded-full bg-primary/15 items-center justify-center">
            <Text className="text-lg font-bold text-primary">{sellerName.charAt(0)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-on-surface">{sellerName}</Text>
            {sellerRating != null && sellerReviewCount != null ? (
              <View className="flex-row items-center gap-1 mt-0.5">
                <Star size={14} color="#d4af37" fill="#d4af37" strokeWidth={0} />
                <Text className="text-sm text-secondary">
                  {sellerRating} ({sellerReviewCount} đánh giá)
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
        {location ? (
          <View className="flex-row items-center gap-1">
            <MapPin size={14} color={COLORS.secondary} strokeWidth={2} />
            <Text className="text-xs text-secondary">{location}</Text>
          </View>
        ) : null}
      </View>

      {(viewCount != null || likeCount != null) && (
        <View className="flex-row items-center gap-6 pt-2 border-t border-surface-container">
          {viewCount != null && (
            <View className="flex-row items-center gap-1.5">
              <Eye size={16} color={COLORS.secondary} strokeWidth={2} />
              <Text className="text-sm text-secondary">{viewCount} lượt xem</Text>
            </View>
          )}
          {likeCount != null && (
            <View className="flex-row items-center gap-1.5">
              <Heart size={16} color={COLORS.secondary} strokeWidth={2} />
              <Text className="text-sm text-secondary">{likeCount} yêu thích</Text>
            </View>
          )}
        </View>
      )}

      {tags && tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <View key={tag} className="bg-surface-container rounded-full px-3 py-1">
              <Text className="text-xs text-secondary">#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {unlocked ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          className="gap-2 pt-2 border-t border-surface-container"
        >
          <Text className="text-xs font-semibold text-secondary uppercase tracking-widest">
            Thông tin liên hệ
          </Text>
          <TouchableOpacity className="flex-row items-center gap-2 bg-primary/10 rounded-xl px-4 py-3">
            <Phone size={16} color={COLORS.primary} strokeWidth={2} />
            <Text className="text-sm font-semibold text-primary">0912 *** ***</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNavigateToConversation}
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
            <Text className="text-sm text-secondary">
              Thông tin liên hệ bị ẩn — mở khóa để xem
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
