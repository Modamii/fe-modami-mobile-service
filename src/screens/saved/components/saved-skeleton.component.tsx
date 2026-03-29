import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SkeletonBox } from '@/components/ui/skeleton.component';

const H_PADDING = 20;
const CARD_GAP = 12;

function CardSkeleton({ width }: { width: number }) {
  return (
    <View style={{ width, gap: 8 }}>
      <SkeletonBox width={width} height={width * 1.25} borderRadius={16} />
      <SkeletonBox width={width * 0.78} height={13} borderRadius={5} />
      <SkeletonBox width={width * 0.5} height={17} borderRadius={5} />
    </View>
  );
}

function GridRow({ cardWidth }: { cardWidth: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: CARD_GAP, paddingHorizontal: H_PADDING }}>
      <CardSkeleton width={cardWidth} />
      <CardSkeleton width={cardWidth} />
    </View>
  );
}

export function SavedScreenSkeleton() {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - H_PADDING * 2 - CARD_GAP) / 2;

  return (
    <View style={{ flex: 1, paddingTop: 12 }}>
      {/* Count subtitle skeleton */}
      <SkeletonBox
        width={100}
        height={12}
        borderRadius={5}
        style={{ marginHorizontal: H_PADDING, marginBottom: 16 }}
      />

      {/* Grid rows */}
      <View style={{ gap: CARD_GAP }}>
        <GridRow cardWidth={cardWidth} />
        <GridRow cardWidth={cardWidth} />
        <GridRow cardWidth={cardWidth} />
      </View>
    </View>
  );
}
