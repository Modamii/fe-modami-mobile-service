import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ProductCard } from '@/components/molecules/product-card.component';
import type { Product } from '@/types/app.type';

type Props = Readonly<{
  products: Product[];
  onPress: (p: Product) => void;
  onViewAll: () => void;
}>;

export function SimilarProducts({ products, onPress, onViewAll }: Props) {
  if (products.length === 0) return null;

  return (
    <View className="pb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-bold text-on-surface">Sản phẩm tương tự</Text>
        <TouchableOpacity onPress={onViewAll} hitSlop={8}>
          <Text className="text-sm font-semibold text-primary">Xem tất cả →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {products.map((p) => (
          <View key={p.id} className="w-[160px]">
            <ProductCard product={p} onPress={onPress} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
