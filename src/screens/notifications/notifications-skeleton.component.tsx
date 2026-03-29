import React from 'react';
import { View } from 'react-native';
import { SkeletonBox } from '@/components/ui/skeleton.component';

function NotificationItemSkeleton({ bodyWidth }: { bodyWidth: `${number}%` }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 20, paddingVertical: 16 }}>
      <SkeletonBox width={36} height={36} borderRadius={18} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBox width="65%" height={13} borderRadius={5} />
        <SkeletonBox width={bodyWidth} height={11} borderRadius={4} />
        <SkeletonBox width={60} height={10} borderRadius={4} />
      </View>
    </View>
  );
}

const DIVIDER = <View style={{ height: 1, backgroundColor: '#edeeed' }} />;

export function NotificationsSkeleton() {
  return (
    <View style={{ flex: 1, paddingTop: 8 }}>
      <NotificationItemSkeleton bodyWidth="85%" />
      {DIVIDER}
      <NotificationItemSkeleton bodyWidth="70%" />
      {DIVIDER}
      <NotificationItemSkeleton bodyWidth="90%" />
      {DIVIDER}
      <NotificationItemSkeleton bodyWidth="60%" />
      {DIVIDER}
      <NotificationItemSkeleton bodyWidth="80%" />
      {DIVIDER}
      <NotificationItemSkeleton bodyWidth="75%" />
    </View>
  );
}
