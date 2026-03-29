import React from 'react';
import { View, Text } from 'react-native';
import { SparklesIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';
import { creditCardShadow } from '../constants/onboarding.constants';

export function CreditIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
  return (
    <View className="items-center justify-center px-6" style={{ height: illustrationH }}>
      {/* Background circle */}
      <View className="absolute w-[220px] h-[220px] rounded-full bg-surface-container" />

      {/* Dark M-Credit card */}
      <View
        className="w-[220px] h-[130px] rounded-2xl bg-[#1a2e3d] p-4 justify-between overflow-hidden"
        style={creditCardShadow}
      >
        {/* Glow orb */}
        <View
          className="absolute w-[140px] h-[140px] rounded-full bg-[rgba(63,103,79,0.35)]"
          style={{ top: -30, right: -30 }}
        />
        <Text className="text-base font-bold text-white/90">M-Credit</Text>

        {/* Balance chip */}
        <View className="bg-white/95 rounded-[10px] px-3 py-2 self-start">
          <Text className="text-[8px] font-semibold text-secondary uppercase tracking-widest mb-[3px]">SỐ DƯ</Text>
          <View className="flex-row items-center gap-1.5">
            <SparklesIcon size={16} color={COLORS.primary} />
            <Text className="text-[13px] font-bold text-on-surface">50 M-Credit</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
