import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import type { MainTabScreenProps } from '@/navigation/types';
import { useAuthStore, useNotificationStore } from '@/store';
import { CreditChip } from '@/components/molecules/CreditChip';
import { ProductCard } from '@/components/molecules/ProductCard';
import { mockProducts } from '@/data/mock-products';
import { COLORS } from '@/constants';

type Props = MainTabScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <View>
            <Text className="text-2xl font-bold text-on-surface tracking-tight">ModaMi</Text>
            <Text className="text-sm text-secondary">Xin chào, {user?.name?.split(' ')[0]} 👋</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <CreditChip onPress={() => navigation.navigate('Credits')} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              className="relative"
            >
              <Bell size={22} color={COLORS.onSurface} strokeWidth={2} />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-primary rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero banner */}
        <View className="mx-5 mb-6 bg-primary rounded-2xl p-5">
          <Text className="text-white text-lg font-bold leading-snug">
            Thời trang bền vững{'\n'}từ cộng đồng Curator
          </Text>
          <Text className="text-white/70 text-sm mt-1">Khám phá hàng nghìn món đồ được tuyển chọn</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Explore')}
            className="bg-white/20 self-start rounded-full px-4 py-2 mt-3"
          >
            <Text className="text-white text-sm font-semibold">Khám phá ngay</Text>
          </TouchableOpacity>
        </View>

        {/* New arrivals */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-5 mb-3">
            <Text className="text-lg font-bold text-on-surface">Mới nhất</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text className="text-sm text-primary font-medium">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-5 gap-3"
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="w-48">
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                />
              </View>
            )}
          />
        </View>

        {/* Trending grid */}
        <View className="px-5 mb-6">
          <Text className="text-lg font-bold text-on-surface mb-3">Xu hướng tuần này</Text>
          <View className="flex-row flex-wrap gap-3">
            {mockProducts.map((product) => (
              <View key={product.id} className="w-[47%]">
                <ProductCard
                  product={product}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
