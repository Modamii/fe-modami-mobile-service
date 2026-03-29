import React, { useMemo, useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { ProductCard } from '@/components/molecules/product-card.component';
import { useHomeScreen } from './hooks/useHomeScreen';
import { HomeHeader } from './components/home-header.component';
import { NewArrivalsSection } from './components/new-arrivals-section.component';
import { CategorySection } from './components/category-section.component';
import { NearbySection } from './components/nearby-section.component';
import { TrendsSection } from './components/trends-section.component';
import { HomeScreenSkeleton } from './components/home-skeleton.component';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from '@/hooks/queries/product.queries';
import type { Product } from '@/types/app.type';
import { COLORS } from '@/constants/app.constants';
import logoDark from '@/assets/logos/logo-text-dark.webp';

type Props = MainTabScreenProps<'Home'>;

const HOME_GRID_GAP = 12;
const HOME_GRID_COLS = 2;

export function HomeScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const [trendGridRowWidth, setTrendGridRowWidth] = useState(0);

  const navigateToProduct = useCallback((product: Product) => {
    queryClient.setQueryData(productKeys.detail(product.id), { data: product });
    navigation.navigate('ProductDetail', { productId: product.id });
  }, [queryClient, navigation]);
  const { width: windowWidth } = useWindowDimensions();

  const homeGridColumnWidth = useMemo(() => {
    const available =
      trendGridRowWidth > 0
        ? trendGridRowWidth
        : Math.max(0, windowWidth - 40);
    return (available - HOME_GRID_GAP * (HOME_GRID_COLS - 1)) / HOME_GRID_COLS;
  }, [trendGridRowWidth, windowWidth]);

  const {
    user,
    unreadCount,
    newArrivals,
    allProducts,
    categories,
    nearbyProducts,
    trends,
    isLoading,
    isRefreshing,
    onRefresh,
  } = useHomeScreen();

  if (isLoading) return <HomeScreenSkeleton />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <HomeHeader
          unreadCount={unreadCount}
          userFirstName={user?.name?.split(' ')[0]}
          onSearchPress={() => navigation.navigate('Explore')}
          onCreditsPress={() => navigation.navigate('Credits')}
          onNotificationsPress={() => navigation.navigate('Notifications')}
        />

        <View className="mx-5 mb-6 bg-[#214b36] rounded-3xl p-5">
          <Image
            source={logoDark}
            className="mb-2 w-[150px] h-[45px]"
            resizeMode="contain"
          />
          <Text className="text-white/90 text-[18px] font-bold my-1">
            {`Thời trang bền vững\ntừ cộng đồng Curator`}
          </Text>
          <Text className="text-white/75 text-[13px] font-medium mt-1">
            Khám phá hàng nghìn món đồ được tuyển chọn
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Explore')}
            className="bg-[#8ea39a] self-start rounded-full px-4 py-2 mt-2.5"
          >
            <Text className="text-white text-[14px] font-semibold">
              Khám phá ngay
            </Text>
          </TouchableOpacity>
        </View>

        <NewArrivalsSection
          data={newArrivals}
          onSeeAll={() => navigation.navigate('Explore')}
          onItemPress={navigateToProduct}
        />

        <CategorySection
          data={categories}
          onCategoryPress={() => navigation.navigate('Explore')}
        />

        <NearbySection
          data={nearbyProducts}
          onItemPress={() => navigation.navigate('Explore')}
        />

        <TrendsSection
          data={trends}
          onSeeAll={() => navigation.navigate('TrendsList')}
          onItemPress={(blogId) => navigation.navigate('BlogDetail', { blogId })}
        />

        <View className="px-5 pt-4 mb-6">
          <Text className="text-xl font-bold text-on-surface mb-3 tracking-tight">
            Xu hướng tuần này
          </Text>
          <View
            className="flex-row flex-wrap w-full"
            style={{ gap: HOME_GRID_GAP, alignItems: 'stretch' }}
            onLayout={(e) => setTrendGridRowWidth(e.nativeEvent.layout.width)}
          >
            {allProducts.map((product) => (
              <View key={product.id} style={{ width: homeGridColumnWidth }}>
                <ProductCard
                  product={product}
                  onPress={navigateToProduct}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
