import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BellIcon,
  TrophyIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  PencilSquareIcon,
} from 'react-native-heroicons/outline';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { useAuthStore } from '@/store/app.store';
import { CreditChip } from '@/components/molecules/credit-chip.component';
import { COLORS, MEMBERSHIP_TIERS } from '@/constants/app.constants';

type Props = MainTabScreenProps<'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuthStore();
  if (!user) return null;

  const tierInfo = MEMBERSHIP_TIERS[user.membershipTier];

  const menuItems = [
    {
      icon: Squares2X2Icon,
      label: 'Bảng điều khiển',
      onPress: () => navigation.navigate('Dashboard'),
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
        {/* Header */}
        <View className="px-5 py-4">
          <Text className="text-2xl font-bold text-on-surface tracking-tight">Hồ sơ</Text>
        </View>

        {/* User card */}
        <View className="mx-5 bg-surface rounded-2xl p-5 gap-4"
          style={{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
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
        <View className="mx-5 mt-4 bg-surface rounded-2xl overflow-hidden"
          style={{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center px-5 py-4 gap-3 ${index < menuItems.length - 1 ? 'border-b border-surface-container' : ''}`}
              activeOpacity={0.7}
            >
              <item.icon size={20} color={COLORS.primary} />
              <Text className="flex-1 text-base text-on-surface">{item.label}</Text>
              <ChevronRightIcon size={16} color={COLORS.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={logout}
          className="mx-5 mt-4 flex-row items-center gap-3 bg-surface rounded-2xl px-5 py-4 mb-6"
          activeOpacity={0.7}
        >
          <ArrowRightOnRectangleIcon size={20} color="#ef4444" />
          <Text className="text-base text-red-500 font-medium">Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
