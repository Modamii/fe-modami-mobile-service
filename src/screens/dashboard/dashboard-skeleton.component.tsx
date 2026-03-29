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

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View
      style={[
        { backgroundColor: '#fff', borderRadius: 24, padding: 16, marginBottom: 20 },
        cardShadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

function SectionLabel() {
  return <SkeletonBox width={140} height={11} borderRadius={4} style={{ marginBottom: 12 }} />;
}

function ListRow({ imageSize = 56 }: { imageSize?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
      <SkeletonBox width={imageSize} height={imageSize} borderRadius={12} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBox width="80%" height={13} borderRadius={5} />
        <SkeletonBox width="50%" height={11} borderRadius={5} />
      </View>
      <SkeletonBox width={48} height={28} borderRadius={14} />
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
      {/* Section label */}
      <SkeletonBox width={160} height={11} borderRadius={4} style={{ marginBottom: 16 }} />

      {/* Profile + credit card */}
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <SkeletonBox width={64} height={64} borderRadius={16} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBox width="60%" height={16} borderRadius={6} />
            <SkeletonBox width="40%" height={12} borderRadius={5} />
          </View>
        </View>
        <SkeletonBox width="100%" height={72} borderRadius={16} />
      </Card>

      {/* Tin đăng */}
      <SectionLabel />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              borderBottomWidth: i < 2 ? 1 : 0,
              borderBottomColor: '#edeeed',
              paddingHorizontal: 16,
            }}
          >
            <ListRow />
          </View>
        ))}
      </Card>

      {/* Pro banner */}
      <Card style={{ backgroundColor: '#f0f4f1' }}>
        <SkeletonBox width="55%" height={14} borderRadius={5} style={{ marginBottom: 8 }} />
        <SkeletonBox width="100%" height={11} borderRadius={4} style={{ marginBottom: 4 }} />
        <SkeletonBox width="80%" height={11} borderRadius={4} style={{ marginBottom: 14 }} />
        <SkeletonBox width="100%" height={42} borderRadius={12} />
      </Card>

      {/* Liên hệ */}
      <SectionLabel />
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: i < 1 ? 1 : 0,
              borderBottomColor: '#edeeed',
            }}
          >
            <SkeletonBox width={40} height={40} borderRadius={20} />
            <View style={{ flex: 1, gap: 7 }}>
              <SkeletonBox width="45%" height={13} borderRadius={5} />
              <SkeletonBox width="70%" height={11} borderRadius={4} />
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}
