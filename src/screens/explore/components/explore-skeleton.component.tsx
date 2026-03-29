import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SkeletonBox } from '@/components/ui/skeleton.component';

const H_PADDING = 20;
const CARD_GAP = 12;

function CardSkeleton({ width }: { width: number }) {
  return (
    <View style={{ width, gap: 8 }}>
      <SkeletonBox width={width} height={width * 1.25} borderRadius={16} />
      <SkeletonBox width={width * 0.75} height={13} borderRadius={5} />
      <SkeletonBox width={width * 0.5} height={17} borderRadius={5} />
    </View>
  );
}

export function ExploreGridSkeleton() {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - H_PADDING * 2 - CARD_GAP) / 2;

  return (
    <View style={{ flex: 1, paddingHorizontal: H_PADDING, paddingTop: 8 }}>
      <SkeletonBox width={120} height={12} borderRadius={5} style={{ marginBottom: 14 }} />

      {/* Row 1 */}
      <View style={{ flexDirection: 'row', gap: CARD_GAP, marginBottom: CARD_GAP }}>
        <CardSkeleton width={cardWidth} />
        <CardSkeleton width={cardWidth} />
      </View>
      {/* Row 2 */}
      <View style={{ flexDirection: 'row', gap: CARD_GAP, marginBottom: CARD_GAP }}>
        <CardSkeleton width={cardWidth} />
        <CardSkeleton width={cardWidth} />
      </View>
      {/* Row 3 */}
      <View style={{ flexDirection: 'row', gap: CARD_GAP }}>
        <CardSkeleton width={cardWidth} />
        <CardSkeleton width={cardWidth} />
      </View>
    </View>
  );
}
