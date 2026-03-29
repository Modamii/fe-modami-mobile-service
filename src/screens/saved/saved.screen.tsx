import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { BookmarkSlashIcon } from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useQueryClient } from '@tanstack/react-query';
import { useProductStore } from '@/store/app.store';
import { useSavedProducts, productKeys } from '@/hooks/queries/product.queries';
import { COLORS } from '@/constants/app.constants';
import { ProductCard } from '@/components/molecules/product-card.component';
import type { Product } from '@/types/app.type';
import { SavedScreenSkeleton } from './components/saved-skeleton.component';

const H_PADDING = 20;
const CARD_GAP = 12;

type Props = RootStackScreenProps<'Saved'>;

export function SavedScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - H_PADDING * 2 - CARD_GAP) / 2;

  const favorites = useProductStore((s) => s.favorites);
  const { data, isLoading, isRefetching, refetch } = useSavedProducts(favorites);

  const products = data?.data ?? [];

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handlePress = useCallback(
    (product: Product) => {
      queryClient.setQueryData(productKeys.detail(product.id), { data: product });
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [queryClient, navigation],
  );

  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <SavedScreenSkeleton />
      ) : products.length === 0 ? (
        <EmptyState onExplore={() => navigation.navigate('Main', { screen: 'Explore' })} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: CARD_GAP, paddingHorizontal: H_PADDING }}
          contentContainerStyle={{ gap: CARD_GAP, paddingTop: 12, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="px-5 text-sm text-secondary">
              {products.length} sản phẩm
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={{ width: cardWidth }}>
              <ProductCard product={item} onPress={handlePress} />
            </View>
          )}
        />
      )}
    </View>
  );
}

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-5">
      <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center">
        <BookmarkSlashIcon size={36} color={COLORS.primary} />
      </View>
      <View className="items-center gap-2">
        <Text className="text-lg font-bold text-on-surface text-center">
          Chưa có sản phẩm nào
        </Text>
        <Text className="text-sm text-secondary text-center leading-5">
          Nhấn vào biểu tượng trái tim trên sản phẩm để lưu lại và xem sau.
        </Text>
      </View>
      <TouchableOpacity
        onPress={onExplore}
        className="bg-primary rounded-2xl px-8 py-4 w-full items-center"
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-base">Khám phá sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
}
