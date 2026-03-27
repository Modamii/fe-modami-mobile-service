import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { ProductCard } from '@/components/molecules/product-card.component';
import { useExploreScreen } from './hooks/useExploreScreen';
import { ExploreSearchBar } from './components/explore-search-bar.component';
import { CategoryChips } from './components/category-chips.component';
import { ExploreEmptyState } from './components/explore-empty-state.component';

type Props = MainTabScreenProps<'Explore'>;

export function ExploreScreen({ navigation }: Props) {
  const {
    query,
    setQuery,
    selectedCategory,
    toggleCategory,
    clearFilters,
    results,
  } = useExploreScreen();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pt-2 pb-3 gap-3">
        <Text className="text-2xl font-black text-on-surface tracking-tight">Khám phá</Text>
        <ExploreSearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          hasActiveFilter={selectedCategory !== null}
        />
        <CategoryChips selected={selectedCategory} onSelect={toggleCategory} />
      </View>

      <View className="px-5 pb-2">
        <Text className="text-xs text-secondary">
          {results.length} sản phẩm
          {selectedCategory ? ` · ${selectedCategory}` : ''}
          {query ? ` · "${query}"` : ''}
        </Text>
      </View>

      <FlatList
        data={results}
        numColumns={2}
        columnWrapperClassName="px-5 gap-3"
        contentContainerClassName="gap-3 pb-6"
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<ExploreEmptyState onClearFilters={clearFilters} />}
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
