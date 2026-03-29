import React from 'react';
import { View } from 'react-native';
import {
  ShieldCheckIcon,
  QrCodeIcon,
  IdentificationIcon,
  CheckBadgeIcon,
  MapPinIcon,
} from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';
import { formShadow } from '../constants/onboarding.constants';

export function TrustIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
  return (
    <View className="items-center justify-center px-6 overflow-visible" style={{ height: illustrationH }}>
      <View className="items-center gap-5">
        {/* Shield circle */}
        <View className="relative items-center justify-center">
          <View className="w-[140px] h-[140px] rounded-full bg-primary items-center justify-center">
            <ShieldCheckIcon size={72} color="#ffffff" />
          </View>
          {/* QR badge */}
          <View className="absolute -bottom-1 -right-1 w-10 h-10 rounded-[10px] bg-surface items-center justify-center border-2 border-surface-container">
            <QrCodeIcon size={18} color={COLORS.primary} />
          </View>
        </View>

        {/* eKYC form fields */}
        <View className="gap-2.5 w-[240px]">
          <View className="flex-row items-center gap-2.5 bg-surface rounded-[10px] px-3.5 py-3" style={formShadow}>
            <IdentificationIcon size={18} color={COLORS.secondary} />
            <View className="flex-1 h-2 rounded bg-surface-container" />
            <CheckBadgeIcon size={18} color={COLORS.primary} />
          </View>
          <View className="flex-row items-center gap-2.5 bg-surface rounded-[10px] px-3.5 py-3" style={formShadow}>
            <MapPinIcon size={18} color={COLORS.secondary} />
            <View className="w-[60%] h-2 rounded bg-surface-container" />
            <CheckBadgeIcon size={18} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </View>
  );
}
