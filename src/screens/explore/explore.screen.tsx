import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { ProductCard } from '@/components/molecules/product-card.component';
import { mockProducts } from '@/data/mock-products.mock';
import { CATEGORIES, COLORS } from '@/constants/app.constants';

type Props = MainTabScreenProps<'Explore'>;

const CATEGORY_EMOJI: Record<string, string> = {
  Tops: '👕',
  Bottoms: '👖',
  Dresses: '👗',
  Outerwear: '🧥',
  Shoes: '👟',
  Bags: '👜',
  Accessories: '💍',
};

export function ExploreScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = mockProducts.filter((p) => {
    const matchesQuery = !query || p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-2 pb-3 gap-3">
        <Text className="text-2xl font-black text-on-surface tracking-tight">Khám phá</Text>

        {/* Search bar */}
        <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 gap-2"
          style={{ shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}>
          <Search size={18} color={COLORS.secondary} strokeWidth={2} />
          <TextInput
            className="flex-1 text-base text-on-surface"
            placeholder="Tìm thương hiệu, sản phẩm..."
            placeholderTextColor={COLORS.secondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color={COLORS.secondary} strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <View className="h-5 w-px bg-surface-container" />
          )}
          <TouchableOpacity>
            <SlidersHorizontal size={18} color={selectedCategory ? COLORS.primary : COLORS.secondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Category chips */}
        <FlatList
          data={[null, ...CATEGORIES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item ?? 'all'}
          contentContainerClassName="gap-2 pr-2"
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(isActive ? null : item)}
                className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${isActive ? 'bg-primary' : 'bg-surface'}`}
                style={isActive ? undefined : { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
              >
                {item && <Text style={{ fontSize: 12 }}>{CATEGORY_EMOJI[item]}</Text>}
                <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-secondary'}`}>
                  {item ?? 'Tất cả'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results count */}
      <View className="px-5 pb-2">
        <Text className="text-xs text-secondary">
          {filtered.length} sản phẩm{selectedCategory ? ` · ${selectedCategory}` : ''}
          {query ? ` · "${query}"` : ''}
        </Text>
      </View>

      {/* Product grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        columnWrapperClassName="px-5 gap-3"
        contentContainerClassName="gap-3 pb-6"
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-20 gap-3">
            <Text className="text-4xl">🔍</Text>
            <Text className="text-on-surface font-semibold">Không tìm thấy kết quả</Text>
            <Text className="text-secondary text-sm text-center px-10">
              Thử tìm kiếm với từ khoá khác hoặc bỏ bộ lọc
            </Text>
            <TouchableOpacity
              onPress={() => { setQuery(''); setSelectedCategory(null); }}
              className="bg-primary/10 rounded-full px-4 py-2"
            >
              <Text className="text-primary text-sm font-semibold">Xoá bộ lọc</Text>
            </TouchableOpacity>
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
