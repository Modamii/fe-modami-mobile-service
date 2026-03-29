import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Lock, Unlock } from 'lucide-react-native';
import { COLORS } from '@/constants/app.constants';
import { formatCredits } from '@/lib/utils.helper';

type Props = Readonly<{
  unlocked: boolean;
  creditCost: number;
  balance: number;
  sellerName: string;
  onUnlock: () => void;
  onMessage: () => void;
}>;

const buttonShadow = Platform.select({
  ios: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
  },
  android: { elevation: 4 },
});

export function UnlockBar({
  unlocked,
  creditCost,
  balance,
  sellerName,
  onUnlock,
  onMessage,
}: Props) {
  if (unlocked) {
    return (
      <View className="flex-row items-center gap-2">
        <View
          accessibilityLabel="Đã mở khóa thông tin liên hệ"
          accessibilityRole="image"
          className="h-14 w-14 shrink-0 rounded-[14px] bg-primary/10 items-center justify-center"
        >
          <Unlock size={22} color={COLORS.primary} strokeWidth={2.5} />
        </View>
        <TouchableOpacity
          onPress={onMessage}
          className="flex-1 h-14 justify-center items-center rounded-[14px] bg-primary px-3"
          style={buttonShadow}
        >
          <Text className="text-white font-bold text-base" numberOfLines={1}>
            Nhắn tin người bán
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onUnlock}
      className="bg-primary rounded-[14px] py-4 px-4 flex-row items-center justify-center gap-2"
      style={buttonShadow}
    >
      <Lock size={18} color="#fff" strokeWidth={2.5} />
      <View className="flex-1 items-center">
        <Text className="text-white font-bold text-base">
          Mở khóa thông tin liên hệ | {creditCost} CREDIT
        </Text>
        <Text className="text-white/75 text-xs mt-0.5">Số dư: {formatCredits(balance)}</Text>
      </View>
    </TouchableOpacity>
  );
}
