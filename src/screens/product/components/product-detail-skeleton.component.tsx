import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SkeletonBox } from '@/components/ui/skeleton.component';
import { IMAGE_HEIGHT, THUMB_SIZE } from '../constants/product-detail.constants';

export function ProductDetailSkeleton() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f8' }}>

      {/* ── Image gallery placeholder ── */}
      <View style={{ height: IMAGE_HEIGHT, backgroundColor: '#e0e0de', position: 'relative' }}>

        {/* Floating: back + share + heart */}
        <View
          style={{
            position: 'absolute', top: insets.top + 8,
            left: 16, right: 16,
            flexDirection: 'row', justifyContent: 'space-between',
            zIndex: 2,
          }}
          pointerEvents="none"
        >
          <SkeletonBox width={40} height={40} borderRadius={20} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SkeletonBox width={40} height={40} borderRadius={20} />
            <SkeletonBox width={40} height={40} borderRadius={20} />
          </View>
        </View>

        {/* Condition badge (top-left) */}
        <View style={{ position: 'absolute', top: 16, left: 16, flexDirection: 'row', gap: 8 }}>
          <SkeletonBox width={60} height={24} borderRadius={12} />
          <SkeletonBox width={90} height={24} borderRadius={12} />
        </View>

        {/* Dot indicators */}
        <View
          style={{
            position: 'absolute', bottom: 72,
            left: 0, right: 0,
            flexDirection: 'row', justifyContent: 'center', gap: 6,
          }}
          pointerEvents="none"
        >
          <SkeletonBox width={16} height={6} borderRadius={3} />
          <SkeletonBox width={6} height={6} borderRadius={3} />
          <SkeletonBox width={6} height={6} borderRadius={3} />
        </View>

        {/* Thumbnail strip overlay */}
        <View
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
            paddingHorizontal: 12, paddingVertical: 8,
            flexDirection: 'row', gap: 8,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBox key={i} width={THUMB_SIZE} height={THUMB_SIZE} borderRadius={8} />
          ))}
        </View>
      </View>

      {/* ── Content below image ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14, gap: 14 }}>

        {/* Breadcrumb */}
        <SkeletonBox width={220} height={11} borderRadius={4} />

        {/* Title + price + badges */}
        <View style={{ gap: 8 }}>
          <SkeletonBox width="90%" height={22} borderRadius={6} />
          <SkeletonBox width="60%" height={22} borderRadius={6} />
          <SkeletonBox width="50%" height={28} borderRadius={6} />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
            <SkeletonBox width={80} height={26} borderRadius={13} />
            <SkeletonBox width={70} height={26} borderRadius={13} />
          </View>
        </View>

        {/* Spec rows preview */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4 }}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: i < 2 ? 1 : 0,
                borderBottomColor: '#edeeed',
              }}
            >
              <SkeletonBox width={90} height={12} borderRadius={4} />
              <SkeletonBox width={70} height={12} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>

      {/* ── Bottom unlock bar ── */}
      <View
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: '#fff',
          paddingHorizontal: 20, paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          borderTopWidth: 1, borderTopColor: '#edeeed',
        }}
      >
        <SkeletonBox width="100%" height={50} borderRadius={16} />
      </View>
    </View>
  );
}
