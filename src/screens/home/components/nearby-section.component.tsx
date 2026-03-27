import React from 'react';
import { View, Text } from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';
import type { NearbyProduct } from '@/types/app.type';
import { NearbyItem } from './nearby-item.component';
import { COLORS } from '@/constants/app.constants';

interface NearbySectionProps {
  data: NearbyProduct[];
  onItemPress: (id: string) => void;
}

export function NearbySection({ data, onItemPress }: NearbySectionProps) {
  return (
    <View className="px-5">
      <View className="flex-row items-center gap-2 mb-4">
        <MapPinIcon size={20} color={COLORS.primary} />
        <Text className="text-xl font-bold text-on-surface" style={{ letterSpacing: -0.3 }}>
          Sản phẩm Gần bạn
        </Text>
      </View>

      <View className="gap-3">
        {data.map((item) => (
          <NearbyItem
            key={item.id}
            item={item}
            onPress={() => onItemPress(item.id)}
          />
        ))}
      </View>
    </View>
  );
}
