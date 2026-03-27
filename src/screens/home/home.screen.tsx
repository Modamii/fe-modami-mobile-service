import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { ProductCard } from '@/components/molecules/product-card.component';
import { mockProducts } from '@/data/mock-products.mock';
import { useHomeScreen } from './hooks/useHomeScreen';
import { HomeHeader } from './components/home-header.component';
import { NewArrivalsSection } from './components/new-arrivals-section.component';
import { CategorySection } from './components/category-section.component';
import { NearbySection } from './components/nearby-section.component';
import { TrendsSection } from './components/trends-section.component';
import logoDark from '@/assets/logos/logo-text-dark.webp';

type Props = MainTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { user, unreadCount, newArrivals, categories, nearbyProducts, trends } = useHomeScreen();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
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
            Thời trang bền vững{'\n'}từ cộng đồng Curator
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
          onItemPress={(id) => navigation.navigate('ProductDetail', { productId: id })}
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
          <View className="flex-row flex-wrap gap-3">
            {mockProducts.map((product) => (
              <View key={product.id} className="w-[47%]">
                <ProductCard
                  product={product}
                  onPress={(selectedProduct) => {
                    navigation.navigate('ProductDetail', { productId: selectedProduct.id });
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
