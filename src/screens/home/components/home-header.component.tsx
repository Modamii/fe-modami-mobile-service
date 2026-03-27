import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { BellIcon } from 'react-native-heroicons/outline';
import { CreditChip } from '@/components/molecules/credit-chip.component';
import { COLORS } from '@/constants/app.constants';
import logoText from '@/assets/logos/modami-logo-text.webp';

interface HomeHeaderProps {
  unreadCount: number;
  userFirstName?: string;
  onNotificationsPress: () => void;
  onCreditsPress: () => void;
  onSearchPress: () => void;
}

export function HomeHeader({
  unreadCount,
  userFirstName,
  onNotificationsPress,
  onCreditsPress,
  onSearchPress,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <TouchableOpacity onPress={onSearchPress} activeOpacity={0.7}>
        <Image
          source={logoText}
          className="w-[150px] h-[45px]"
          resizeMode="contain"
        />
        <Text className="text-sm text-secondary mt-0.5">
          Xin chào, {userFirstName ?? 'bạn'} 👋
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center gap-3">
        <CreditChip onPress={onCreditsPress} />
        <TouchableOpacity onPress={onNotificationsPress} className="relative" hitSlop={8}>
          <BellIcon size={22} color={COLORS.onSurface} />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-primary rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-white text-[10px] font-bold">{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
