import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Star } from 'lucide-react-native';
import { COLORS } from '@/constants/app.constants';
import type { SellerReview } from '@/types/app.type';

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

type Props = Readonly<{ review: SellerReview }>;

export function ReviewCard({ review }: Props) {
  return (
    <View
      className="bg-surface-container rounded-2xl p-4 gap-2"
      style={cardShadow}
    >
      <View className="flex-row items-start gap-3">
        <View className="w-10 h-10 rounded-full bg-surface-highest items-center justify-center">
          <Text className="text-sm font-bold text-primary">{review.buyerInitial}</Text>
        </View>
        <View className="flex-1 min-w-0">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 min-w-0">
              <Text className="text-sm font-bold text-on-surface">{review.buyerName}</Text>
              <Text className="text-xs text-secondary mt-0.5" numberOfLines={2}>
                Đã mua: {review.boughtProductTitle}
              </Text>
            </View>
            <View className="flex-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  color={i < review.rating ? '#e8a317' : COLORS.outlineVariant}
                  fill={i < review.rating ? '#e8a317' : 'transparent'}
                  strokeWidth={i < review.rating ? 0 : 1.5}
                />
              ))}
            </View>
          </View>
          <Text className="text-sm text-secondary leading-5 mt-2">{review.comment}</Text>
        </View>
      </View>
    </View>
  );
}
