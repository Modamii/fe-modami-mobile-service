import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import type { MainTabScreenProps } from '@/navigation/types';
import { ProductCard } from '@/components/molecules/ProductCard';
import { mockProducts } from '@/data/mock-products';
import { CATEGORIES, COLORS } from '@/constants';

type Props = MainTabScreenProps<'Explore'>;

export function ExploreScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = mockProducts.filter((p) => {
    const matchesQuery =
      !query || p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      !selectedCategory || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Search header */}
      <View className="px-5 py-3 gap-3">
        <View className="flex-row items-center bg-surface-container rounded-xl px-4 py-3 gap-2">
          <Search size={18} color={COLORS.secondary} strokeWidth={2} />
          <TextInput
            className="flex-1 text-base text-on-surface"
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor={COLORS.secondary}
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity>
            <SlidersHorizontal size={18} color={COLORS.secondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Category pills */}
        <FlatList
          data={[null, ...CATEGORIES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item ?? 'all'}
          contentContainerClassName="gap-2"
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                className={`rounded-full px-4 py-2 ${isActive ? 'bg-primary' : 'bg-surface-container'}`}
              >
                <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-secondary'}`}>
                  {item ?? 'Tất cả'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        numColumns={2}
        columnWrapperClassName="px-5 gap-3"
        contentContainerClassName="gap-3 pb-6 pt-2"
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-secondary text-base">Không tìm thấy sản phẩm</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-1">
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
