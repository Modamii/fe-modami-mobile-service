import React from 'react';
import { View, Text, Image } from 'react-native';
import { COLORS } from '@/constants/app.constants';
import type { ChatMessage } from '@/screens/messages/types/chat.types';

type Props = Readonly<{ product: NonNullable<ChatMessage['productRef']> }>;

export function ProductContextCard({ product }: Props) {
  return (
    <View
      className="flex-row items-center gap-3 bg-surface rounded-2xl p-3 mx-4 mb-2"
      style={{
        shadowColor: COLORS.onSurface,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      <Image
        source={{ uri: product.image }}
        className="w-14 h-14 rounded-xl bg-surface-container"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-xs text-secondary uppercase tracking-widest font-semibold">
          Cuộc hội thoại về
        </Text>
        <Text className="text-sm font-bold text-on-surface mt-0.5" numberOfLines={1}>
          {product.title}
        </Text>
        <Text className="text-sm text-primary font-semibold mt-0.5">{product.price}</Text>
      </View>
    </View>
  );
}
