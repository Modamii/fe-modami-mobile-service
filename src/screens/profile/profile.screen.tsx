import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BellIcon,
  TrophyIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  PencilSquareIcon,
  BookmarkIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
} from 'react-native-heroicons/outline';
import { useProductStore } from '@/store/app.store';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { useAuthStore } from '@/store/app.store';
import { CreditChip } from '@/components/molecules/credit-chip.component';
import { COLORS, MEMBERSHIP_TIERS } from '@/constants/app.constants';

type Props = MainTabScreenProps<'Profile'>;

const cardShadow = Platform.select({
  ios: { shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  android: { elevation: 2 },
});

function GuestProfileView({ navigation }: Pick<Props, 'navigation'>) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4">
        <Text className="text-2xl font-bold text-on-surface tracking-tight">Hồ sơ</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8 gap-5">
        <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center">
          <Text className="text-4xl">👤</Text>
        </View>
        <View className="items-center gap-2">
          <Text className="text-lg font-bold text-on-surface text-center">Chưa đăng nhập</Text>
          <Text className="text-sm text-secondary text-center leading-5">
            Đăng nhập để xem hồ sơ, quản lý tin đăng và theo dõi credits của bạn.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="bg-primary rounded-2xl px-8 py-4 w-full items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          className="bg-surface-container rounded-2xl px-8 py-4 w-full items-center"
          activeOpacity={0.85}
        >
          <Text className="text-on-surface font-semibold text-base">Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuthStore();
  const savedCount = useProductStore((s) => s.favorites.length);

  if (!user) return <GuestProfileView navigation={navigation} />;

  const tierInfo = MEMBERSHIP_TIERS[user.membershipTier];

  const menuItems = [
    {
      icon: Squares2X2Icon,
      label: 'Bảng điều khiển',
      onPress: () => navigation.navigate('Dashboard'),
    },
    {
      icon: ClipboardDocumentListIcon,
      label: 'Bài đăng của tôi',
      onPress: () => navigation.navigate('MyListings'),
    },
    {
      icon: ShoppingBagIcon,
      label: 'Lịch sử mua hàng',
      onPress: () => navigation.navigate('OrderHistory'),
    },
    {
      icon: BookmarkIcon,
      label: 'Đã lưu',
      badge: savedCount > 0 ? String(savedCount) : undefined,
      onPress: () => navigation.navigate('Saved'),
    },
    {
      icon: PencilSquareIcon,
      label: 'Chỉnh sửa hồ sơ',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: BellIcon,
      label: 'Thông báo',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: CreditCardIcon,
      label: 'ModaMi Credits',
      onPress: () => navigation.navigate('Credits'),
    },
    {
      icon: TrophyIcon,
      label: 'Gói thành viên',
      onPress: () => navigation.navigate('Membership'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-4">
          <Text className="text-2xl font-bold text-on-surface tracking-tight">Hồ sơ</Text>
        </View>

        {/* User card */}
        <View className="mx-5 bg-surface rounded-2xl p-5 gap-4" style={cardShadow}>
          <View className="flex-row items-center gap-4">
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} className="w-16 h-16 rounded-full" />
            ) : (
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
                <Text className="text-white text-2xl font-bold">{user.name[0]}</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-lg font-bold text-on-surface">{user.name}</Text>
              {user.username && (
                <Text className="text-xs text-secondary font-medium">@{user.username}</Text>
              )}
              <Text className="text-sm text-secondary">{user.email}</Text>
              <View className="flex-row items-center gap-2 mt-1">
                <View className="bg-primary/10 rounded-full px-2 py-0.5">
                  <Text className="text-xs font-semibold text-primary">{tierInfo.label}</Text>
                </View>
                <CreditChip onPress={() => navigation.navigate('Credits')} />
              </View>
            </View>
          </View>
          {user.bio && (
            <Text className="text-sm text-secondary">{user.bio}</Text>
          )}
        </View>

        {/* Menu */}
        <View className="mx-5 mt-4 bg-surface rounded-2xl overflow-hidden" style={cardShadow}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center px-5 py-4 gap-3 ${index < menuItems.length - 1 ? 'border-b border-surface-container' : ''}`}
              activeOpacity={0.7}
            >
              <item.icon size={20} color={COLORS.primary} />
              <Text className="flex-1 text-base text-on-surface">{item.label}</Text>
              {'badge' in item && item.badge ? (
                <View className="bg-primary rounded-full px-2 py-0.5 mr-1">
                  <Text className="text-white text-xs font-bold">{item.badge}</Text>
                </View>
              ) : null}
              <ChevronRightIcon size={16} color={COLORS.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={logout}
          className="mx-5 mt-4 flex-row items-center gap-3 bg-surface rounded-2xl px-5 py-4 mb-6"
          style={cardShadow}
          activeOpacity={0.7}
        >
          <ArrowRightOnRectangleIcon size={20} color="#ef4444" />
          <Text className="text-base text-red-500 font-medium">Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
