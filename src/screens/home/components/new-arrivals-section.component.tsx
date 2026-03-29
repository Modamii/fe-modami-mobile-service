import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import type { Product } from '@/types/app.type';
import { NewArrivalsCard } from './new-arrivals-card.component';

const CARD_WIDTH = 272;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

interface NewArrivalsSectionProps {
  data: Product[];
  onSeeAll: () => void;
  onItemPress: (product: Product) => void;
}

export function NewArrivalsSection({ data, onSeeAll, onItemPress }: NewArrivalsSectionProps) {
  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-end px-5 mb-4">
        <Text className="text-2xl font-extrabold text-on-surface" style={{ letterSpacing: -0.5 }}>
          Mới Cập Nhật
        </Text>
        <TouchableOpacity onPress={onSeeAll} hitSlop={8}>
          <Text className="text-xs font-semibold text-primary/70 uppercase tracking-widest">
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, gap: CARD_GAP }}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        snapToAlignment="start"
        renderItem={({ item }) => (
          <NewArrivalsCard item={item} onPress={() => onItemPress(item)} />
        )}
      />
    </View>
  );
}
