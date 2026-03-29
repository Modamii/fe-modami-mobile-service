import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LockClosedIcon } from 'react-native-heroicons/solid';
import type { Product } from '@/types/app.type';
import { formatPrice } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(product)}
      activeOpacity={0.9}
      className="flex-1 bg-surface rounded-2xl overflow-hidden"
      style={{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}
    >
      <View className="relative overflow-hidden">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full aspect-square"
          resizeMode="cover"
        />
        {product.isUnlockRequired && (
          <View className="absolute top-2 right-2 bg-on-surface/60 rounded-full p-1.5">
            <LockClosedIcon size={12} color="#fff" />
          </View>
        )}
      </View>

      <View className="flex-1 p-3 justify-between">
        <View className="gap-1">
          <Text className="text-sm font-semibold text-on-surface leading-snug" numberOfLines={2}>
            {product.title}
          </Text>
          <Text className="text-xs text-secondary" numberOfLines={1}>
            {product.brand ? `${product.brand} · ` : ''}{product.condition}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm font-bold text-primary">
            {formatPrice(product.price)}
          </Text>
          {product.isUnlockRequired && (
            <View className="flex-row items-center gap-0.5 bg-primary/10 rounded-full px-2 py-0.5">
              <Text className="text-xs font-semibold text-primary">
                {product.creditCost} credits
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
