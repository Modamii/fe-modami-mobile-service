import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SkeletonBox } from '@/components/ui/skeleton.component';

const DIVIDER = <View style={{ height: 1, backgroundColor: '#edeeed' }} />;

function ConversationItemSkeleton({ nameWidth }: { nameWidth: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 }}>
      <SkeletonBox width={48} height={48} borderRadius={24} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SkeletonBox width={nameWidth} height={14} borderRadius={5} />
          <View style={{ flex: 1 }} />
          <SkeletonBox width={36} height={11} borderRadius={4} />
        </View>
        <SkeletonBox width="75%" height={12} borderRadius={4} />
      </View>
    </View>
  );
}

export function MessagesScreenSkeleton() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f8' }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <SkeletonBox width={120} height={28} borderRadius={8} />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ConversationItemSkeleton nameWidth={110} />
        {DIVIDER}
        <ConversationItemSkeleton nameWidth={140} />
        {DIVIDER}
        <ConversationItemSkeleton nameWidth={95} />
        {DIVIDER}
        <ConversationItemSkeleton nameWidth={125} />
        {DIVIDER}
        <ConversationItemSkeleton nameWidth={105} />
      </View>
    </SafeAreaView>
  );
}
