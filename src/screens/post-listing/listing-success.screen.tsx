import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircleIcon, ClockIcon } from 'react-native-heroicons/solid';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import type { ProductCondition } from '@/types/app.type';
import { COLORS } from '@/constants/app.constants';

const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: 'Mới',
  'like-new': 'Như mới',
  good: 'Tốt',
  fair: 'Khá',
};

type Props = RootStackScreenProps<'ListingSuccess'>;

export function ListingSuccessScreen({ navigation, route }: Props) {
  const { listing } = route.params;
  const firstImage = listing.images[0] ?? null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 py-8 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Success icon + title */}
        <View className="items-center gap-4">
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center">
            <CheckCircleIcon size={44} color={COLORS.primary} />
          </View>
          <View className="items-center gap-1">
            <Text className="text-2xl font-black text-on-surface tracking-tight text-center">
              Đăng bài thành công!
            </Text>
            <Text className="text-sm text-secondary text-center">
              Sản phẩm đang chờ kiểm duyệt
            </Text>
          </View>
        </View>

        {/* Listing info card */}
        <View className="bg-surface rounded-2xl overflow-hidden" style={{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
          {firstImage ? (
            <Image
              source={{ uri: firstImage }}
              className="w-full"
              style={{ height: 200 }}
              resizeMode="cover"
            />
          ) : (
            <View className="w-full bg-surface-container items-center justify-center" style={{ height: 160 }}>
              <Text className="text-sm text-secondary">Không có ảnh</Text>
            </View>
          )}
          <View className="p-4 gap-3">
            <Text className="text-base font-bold text-on-surface" numberOfLines={2}>
              {listing.title}
            </Text>
            <Text className="text-lg font-black text-primary">
              {listing.price.toLocaleString('vi-VN')}₫
            </Text>
            <View className="flex-row gap-2">
              <View className="bg-surface-container rounded-full px-3 py-1">
                <Text className="text-xs font-medium text-on-surface/70">
                  {listing.category}
                </Text>
              </View>
              <View className="bg-primary/10 rounded-full px-3 py-1">
                <Text className="text-xs font-medium text-primary">
                  {CONDITION_LABELS[listing.condition]}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Review info box */}
        <View className="bg-primary/10 rounded-2xl p-4 flex-row gap-3 items-start">
          <ClockIcon size={20} color={COLORS.primary} />
          <Text className="flex-1 text-sm text-primary leading-5">
            Bài đăng của bạn đang được đội ngũ ModaMi xem xét. Chúng tôi sẽ thông báo kết quả trong vòng 24 giờ.
          </Text>
        </View>

        {/* Actions */}
        <View className="gap-3">
          <TouchableOpacity
            onPress={() =>
              navigation.replace('MyListings')
            }
            className="bg-primary rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Xem bài đăng của tôi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.replace('Main', { screen: 'PostListing' })
            }
            className="border border-primary rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-primary font-bold text-base">Tiếp tục đăng bán</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
