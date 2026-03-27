import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AcademicCapIcon } from 'react-native-heroicons/outline';
import type { NearbyProduct } from '@/types/app.type';
import { formatPriceShort } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';

interface NearbyItemProps {
  item: NearbyProduct;
  onPress: () => void;
}

export function NearbyItem({ item, onPress }: NearbyItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      className="flex-row gap-4 p-3 bg-surface-low rounded-3xl"
    >
      <View className="w-24 h-24 rounded-2xl overflow-hidden">
        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
      </View>

      <View className="flex-1 py-1 justify-between">
        <View>
          <View className="flex-row justify-between items-start gap-2">
            <Text className="font-bold text-on-surface flex-1" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="font-bold text-primary shrink-0">
              {formatPriceShort(item.price)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 mt-1">
            <AcademicCapIcon size={12} color={COLORS.secondary} />
            <Text className="text-xs text-secondary flex-1" numberOfLines={1}>
              {item.locationLabel}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View
            style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: item.sellerAvatarColor }}
          />
          <Text className="text-[10px] font-bold text-secondary uppercase tracking-wider">
            {item.sellerName} • {item.distance}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
