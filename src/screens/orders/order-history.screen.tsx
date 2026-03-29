import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  CubeIcon,
} from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useMyOrders } from '@/hooks/queries/order.queries';
import { formatPrice } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';
import { SkeletonBox } from '@/components/ui/skeleton.component';
import type { Order, OrderStatus } from '@/types/app.type';

type Props = RootStackScreenProps<'OrderHistory'>;

const cardShadow = Platform.select({
  ios: { shadowColor: '#191c1c', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  android: { elevation: 1 },
});

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  processing: { label: 'Đang xử lý', color: '#b45309', bg: '#fef3c7', icon: ClockIcon },
  confirmed: { label: 'Đã xác nhận', color: '#1d4ed8', bg: '#dbeafe', icon: CubeIcon },
  shipped: { label: 'Đang giao', color: '#0369a1', bg: '#e0f2fe', icon: TruckIcon },
  delivered: { label: 'Đã nhận', color: '#166534', bg: '#dcfce7', icon: CheckCircleIcon },
  cancelled: { label: 'Đã huỷ', color: '#991b1b', bg: '#fee2e2', icon: XCircleIcon },
};

function OrderCard({ item, onPress }: { item: Order; onPress: () => void }) {
  const cfg = STATUS_CONFIG[item.status];
  const Icon = cfg.icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12 },
        cardShadow,
      ]}
    >
      <Image
        source={{ uri: item.productImage }}
        style={{ width: 72, height: 72, borderRadius: 10, backgroundColor: '#f5f5f4' }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.onSurface }} numberOfLines={2}>
          {item.productTitle}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
          {formatPrice(item.productPrice)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: cfg.bg }}>
            <Icon size={11} color={cfg.color} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: cfg.color }}>{cfg.label}</Text>
          </View>
          <Text style={{ fontSize: 11, color: COLORS.secondary }}>{item.sellerName}</Text>
        </View>
        {item.trackingCode && (
          <Text style={{ fontSize: 11, color: COLORS.secondary }}>
            Mã vận đơn: {item.trackingCode}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function LoadingSkeleton() {
  return (
    <View style={{ gap: 10, padding: 20 }}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 14 }}>
          <SkeletonBox width={72} height={72} borderRadius={10} />
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonBox width="75%" height={14} borderRadius={5} />
            <SkeletonBox width="40%" height={14} borderRadius={5} />
            <SkeletonBox width={100} height={22} borderRadius={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function OrderHistoryScreen({ navigation }: Props) {
  const { data, isLoading, isRefetching, refetch } = useMyOrders();
  const orders = data?.data ?? [];

  if (isLoading) return <LoadingSkeleton />;

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: '#f9f9f8' }}
      contentContainerStyle={{ gap: 10, paddingVertical: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
      ListEmptyComponent={
        <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.onSurface, textAlign: 'center' }}>
            Chưa có đơn hàng nào
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.secondary, textAlign: 'center', marginTop: 6 }}>
            Khám phá sản phẩm và bắt đầu mua sắm
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Explore' })}
            style={{ marginTop: 20, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Khám phá ngay</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <OrderCard
          item={item}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.productId })}
        />
      )}
    />
  );
}
