import React from 'react';
import { View, Platform } from 'react-native';
import { SkeletonBox } from '@/components/ui/skeleton.component';
import { COLORS } from '@/constants/app.constants';

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

export function CreditsSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f8' }}>
      {/* Balance card */}
      <View
        style={[
          {
            margin: 20,
            marginTop: 16,
            borderRadius: 24,
            padding: 24,
            backgroundColor: COLORS.primary,
            gap: 8,
          },
          Platform.select({
            ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24 },
            android: { elevation: 6 },
          }),
        ]}
      >
        <SkeletonBox width={80} height={11} borderRadius={5} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
        <SkeletonBox width={140} height={52} borderRadius={10} style={{ backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 4 }} />
        <SkeletonBox width={100} height={11} borderRadius={5} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <SkeletonBox width={100} height={28} borderRadius={14} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <SkeletonBox width={80} height={28} borderRadius={14} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </View>
      </View>

      {/* How it works card */}
      <View style={[{ marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12 }, cardShadow]}>
        <SkeletonBox width={200} height={13} borderRadius={5} />
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <SkeletonBox width={24} height={24} borderRadius={12} />
            <SkeletonBox width="75%" height={11} borderRadius={5} />
          </View>
        ))}
      </View>

      {/* Packages */}
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <SkeletonBox width={100} height={13} borderRadius={5} style={{ marginBottom: 12 }} />
        <View style={{ gap: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[{ backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }, cardShadow]}>
              <SkeletonBox width={40} height={40} borderRadius={20} />
              <View style={{ flex: 1, gap: 8 }}>
                <SkeletonBox width="55%" height={14} borderRadius={5} />
                <SkeletonBox width="35%" height={11} borderRadius={4} />
              </View>
              <SkeletonBox width={80} height={36} borderRadius={18} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
