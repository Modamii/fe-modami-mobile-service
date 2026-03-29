import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '@/constants/app.constants';
import type { TrendBlog } from '@/types/app.type';

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

type Props = Readonly<{
  item: TrendBlog;
  onPress: () => void;
}>;

export function TrendListRow({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row gap-3 bg-surface rounded-2xl p-3 overflow-hidden"
      style={cardShadow}
    >
      <Image source={{ uri: item.image }} className="w-[88px] h-[88px] rounded-xl bg-surface-container" resizeMode="cover" />
      <View className="flex-1 justify-center">
        <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">{item.topic}</Text>
        <Text className="text-sm font-bold text-on-surface mt-0.5" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-xs text-secondary mt-1" numberOfLines={2}>
          {item.excerpt}
        </Text>
        {item.author ? (
          <Text className="text-[10px] text-secondary mt-1.5 font-medium" numberOfLines={1}>
            {item.author}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
