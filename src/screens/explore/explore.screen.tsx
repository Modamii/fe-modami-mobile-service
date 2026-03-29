import React, { useRef, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from '@/hooks/queries/product.queries';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { ProductCard } from '@/components/molecules/product-card.component';
import { useExploreScreen } from './hooks/useExploreScreen';
import { ExploreSearchBar } from './components/explore-search-bar.component';
import { CategoryChips } from './components/category-chips.component';
import { ExploreEmptyState } from './components/explore-empty-state.component';
import { ExploreGridSkeleton } from './components/explore-skeleton.component';
import { FilterBottomSheet } from './components/filter-bottom-sheet.component';
import { COLORS } from '@/constants/app.constants';

type Props = MainTabScreenProps<'Explore'>;

export function ExploreScreen({ navigation }: Props) {
  const {
    query,
    setQuery,
    selectedCategory,
    toggleCategory,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilter,
    results,
    isLoading,
    isRefreshing,
    onRefresh,
  } = useExploreScreen();

  const queryClient = useQueryClient();
  const filterSheetRef = useRef<BottomSheet>(null);

  const openFilter = useCallback(() => {
    filterSheetRef.current?.expand();
  }, []);

  const closeFilter = useCallback(() => {
    filterSheetRef.current?.close();
  }, []);

  return (
    <>
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="px-5 pt-2 pb-3 gap-3">
          <Text className="text-2xl font-black text-on-surface tracking-tight">Khám phá</Text>
          <ExploreSearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            hasActiveFilter={hasActiveFilter}
            onFilterPress={openFilter}
          />
          <CategoryChips selected={selectedCategory} onSelect={toggleCategory} />
        </View>

        {isLoading ? (
          <ExploreGridSkeleton />
        ) : (
          <>
            <View className="px-5 pb-2">
              <Text className="text-sm text-secondary">
                {results.length} sản phẩm
                {selectedCategory ? ` · ${selectedCategory}` : ''}
                {query ? ` · "${query}"` : ''}
                {filters.conditions.length > 0 ? ` · ${filters.conditions.length} tình trạng` : ''}
                {filters.priceMin !== null || filters.priceMax !== null ? ' · có lọc giá' : ''}
              </Text>
            </View>

            <FlatList
              data={results}
              numColumns={2}
              columnWrapperClassName="px-5 gap-3"
              columnWrapperStyle={{ alignItems: 'stretch' }}
              contentContainerClassName="gap-3 pb-6"
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
              ListEmptyComponent={<ExploreEmptyState onClearFilters={clearFilters} />}
              renderItem={({ item }) => (
                <View className="flex-1">
                  <ProductCard
                    product={item}
                    onPress={(product) => {
                    queryClient.setQueryData(productKeys.detail(product.id), { data: product });
                    navigation.navigate('ProductDetail', { productId: product.id });
                  }}
                  />
                </View>
              )}
            />
          </>
        )}
      </SafeAreaView>

      <FilterBottomSheet
        ref={filterSheetRef}
        filters={filters}
        onApply={setFilters}
        onClose={closeFilter}
      />
    </>
  );
}
