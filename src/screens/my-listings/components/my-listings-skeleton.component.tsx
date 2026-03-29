import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from '@/components/ui/skeleton.component';

function ListingItemSkeleton() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 14 }}>
      <SkeletonBox width={72} height={72} borderRadius={12} />
      <View style={{ flex: 1, gap: 8, justifyContent: 'center' }}>
        <SkeletonBox width="70%" height={13} borderRadius={5} />
        <SkeletonBox width="40%" height={12} borderRadius={4} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
          <SkeletonBox width={72} height={22} borderRadius={11} />
          <SkeletonBox width={56} height={22} borderRadius={11} />
        </View>
      </View>
    </View>
  );
}

const DIVIDER = <View style={{ height: 1, backgroundColor: '#edeeed', marginHorizontal: 20 }} />;

export function MyListingsSkeleton() {
  return (
    <View style={{ flex: 1, paddingTop: 8 }}>
      {/* Filter tabs skeleton */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 16 }}>
        {[80, 96, 80, 72].map((w, i) => (
          <SkeletonBox key={i} width={w} height={32} borderRadius={16} />
        ))}
      </View>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i}>
          {i > 0 && DIVIDER}
          <ListingItemSkeleton />
        </View>
      ))}
    </View>
  );
}
