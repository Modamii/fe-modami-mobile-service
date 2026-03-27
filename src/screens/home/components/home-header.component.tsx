import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, BellIcon } from 'react-native-heroicons/outline';
import { CreditChip } from '@/components/molecules/credit-chip.component';
import { COLORS } from '@/constants/app.constants';

interface HomeHeaderProps {
  unreadCount: number;
  onNotificationsPress: () => void;
  onCreditsPress: () => void;
  onSearchPress: () => void;
}

export function HomeHeader({
  unreadCount,
  onNotificationsPress,
  onCreditsPress,
  onSearchPress,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <TouchableOpacity onPress={onSearchPress} className="flex-row items-center gap-3" activeOpacity={0.7}>
        <MagnifyingGlassIcon size={22} color={COLORS.primary} />
        <Text className="text-xl font-extrabold text-primary" style={{ letterSpacing: -0.5 }}>
          ModaMi
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
