import React from 'react';
import { View, Text } from 'react-native';
import type { HomeCategory } from '@/types/app.type';
import { CategoryItem } from './category-item.component';

interface CategorySectionProps {
  data: HomeCategory[];
  onCategoryPress: (category: string) => void;
}

export function CategorySection({ data, onCategoryPress }: CategorySectionProps) {
  const topRow = data.slice(0, 2);
  const bottomRow = data.slice(2, 4);

  return (
    <View className="px-5 mb-8">
      <Text className="text-xl font-bold text-on-surface mb-4" style={{ letterSpacing: -0.3 }}>
        Khám Phá Danh Mục
      </Text>
      <View className="gap-3">
        <View className="flex-row gap-3">
          {topRow.map((cat) => (
            <View key={cat.id} className="flex-1">
              <CategoryItem item={cat} onPress={onCategoryPress} />
            </View>
          ))}
        </View>
        <View className="flex-row gap-3">
          {bottomRow.map((cat) => (
            <View key={cat.id} className="flex-1">
              <CategoryItem item={cat} onPress={onCategoryPress} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
