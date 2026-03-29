import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonBox } from '@/components/ui/skeleton.component';

export function HomeScreenSkeleton() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f8' }} edges={['top']}>
      {/* Header: logo + icons + search + greeting */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <SkeletonBox width={120} height={30} borderRadius={6} />
          <View style={{ flex: 1 }} />
          <SkeletonBox width={32} height={32} borderRadius={16} />
          <SkeletonBox width={32} height={32} borderRadius={16} />
        </View>
        <SkeletonBox width="100%" height={44} borderRadius={14} />
        <SkeletonBox width={200} height={16} borderRadius={6} />
      </View>

      {/* Hero banner */}
      <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
        <SkeletonBox width="100%" height={160} borderRadius={24} />
      </View>

      {/* New Arrivals: title + 2 cards */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 }}>
          <SkeletonBox width={150} height={22} borderRadius={6} />
          <SkeletonBox width={60} height={14} borderRadius={6} />
        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12 }}>
          <View style={{ width: 200, gap: 8 }}>
            <SkeletonBox width={200} height={150} borderRadius={16} />
            <SkeletonBox width={150} height={13} borderRadius={5} />
            <SkeletonBox width={90} height={16} borderRadius={5} />
          </View>
          <View style={{ width: 200, gap: 8 }}>
            <SkeletonBox width={200} height={150} borderRadius={16} />
            <SkeletonBox width={130} height={13} borderRadius={5} />
            <SkeletonBox width={100} height={16} borderRadius={5} />
          </View>
        </View>
      </View>

      {/* Category: title + 2x2 grid */}
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        <SkeletonBox width={170} height={20} borderRadius={6} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SkeletonBox width="48%" height={80} borderRadius={16} />
          <SkeletonBox width="48%" height={80} borderRadius={16} />
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SkeletonBox width="48%" height={80} borderRadius={16} />
          <SkeletonBox width="48%" height={80} borderRadius={16} />
        </View>
      </View>
    </SafeAreaView>
  );
}
