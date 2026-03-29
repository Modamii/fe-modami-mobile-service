import React from 'react';
import { View, Text, Image } from 'react-native';
import { cardShadow, badgeShadow } from '../constants/onboarding.constants';

export function DiscoverIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
  return (
    <View className="items-center justify-center px-6 overflow-visible" style={{ height: illustrationH }}>
      <View className="w-full flex-1 relative">
        {/* Tonal offset layer */}
        <View
          className="absolute bg-surface-low rounded-2xl"
          style={{ top: -10, right: -10, width: '100%', height: '100%' }}
        />
        {/* Main image card */}
        <View className="w-full h-full rounded-2xl overflow-hidden bg-surface-container" style={cardShadow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80' }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
        </View>
        {/* Floating badge */}
        <View
          className="absolute bg-background/90 px-4 py-2.5 rounded-[10px]"
          style={{ bottom: 20, left: -12, ...badgeShadow }}
        >
          <Text className="text-[9px] font-semibold text-primary uppercase tracking-widest mb-[3px]">
            CURATION VOL. 01
          </Text>
          <Text className="text-[13px] font-extrabold text-on-surface">Tuyển chọn bởi ModaMi</Text>
        </View>
      </View>
    </View>
  );
}
