import React from 'react';
import { View, Text, Image } from 'react-native';
import { SparklesIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';
import { cardShadow, badgeShadow } from '../constants/onboarding.constants';

export function ImpactIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
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
            source={{ uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
        </View>
        {/* Floating badge — right side */}
        <View
          className="absolute flex-row items-center gap-1.5 bg-background/90 px-4 py-2.5 rounded-[10px]"
          style={{ bottom: 20, right: -12, ...badgeShadow }}
        >
          <SparklesIcon size={14} color={COLORS.primary} />
          <Text className="text-[9px] font-semibold text-primary uppercase tracking-widest">SỐNG XANH CÙNG MI</Text>
        </View>
      </View>
    </View>
  );
}
