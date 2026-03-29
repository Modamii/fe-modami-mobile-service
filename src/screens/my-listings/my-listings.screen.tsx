import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import {
  useMyListings,
  useSeedListingCache,
} from '@/hooks/queries/listing.queries';
import { formatPrice } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';
import type { MyListing, ListingStatus } from '@/types/app.type';
import { MyListingsSkeleton } from './components/my-listings-skeleton.component';

type Props = RootStackScreenProps<'MyListings'>;

const TABS: { label: string; value: ListingStatus | 'all' }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ duyệt', value: 'pending' },
  { label: 'Đang xét', value: 'under_review' },
  { label: 'Đang bán', value: 'approved' },
  { label: 'Từ chối', value: 'rejected' },
  { label: 'Đã bán', value: 'sold' },
];

const STATUS_CONFIG: Record<
  ListingStatus,
  { label: string; color: string; bg: string; icon: any }
> = {
  pending: {
    label: 'Chờ duyệt',
    color: '#b45309',
    bg: '#fef3c7',
    icon: ClockIcon,
  },
  under_review: {
    label: 'Đang xét',
    color: '#1d4ed8',
    bg: '#dbeafe',
    icon: ClockIcon,
  },
  approved: {
    label: 'Đang bán',
    color: '#166534',
    bg: '#dcfce7',
    icon: CheckCircleIcon,
  },
  rejected: {
    label: 'Từ chối',
    color: '#991b1b',
    bg: '#fee2e2',
    icon: ExclamationCircleIcon,
  },
  sold: {
    label: 'Đã bán',
    color: '#5f5e5e',
    bg: '#f3f4f6',
    icon: CheckCircleIcon,
  },
};

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#191c1c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  android: { elevation: 1 },
});

function ListingCard({
  item,
  onPress,
}: {
  item: MyListing;
  onPress: () => void;
}) {
  const cfg = STATUS_CONFIG[item.status];
  const Icon = cfg.icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: '#fff',
          marginHorizontal: 20,
          borderRadius: 16,
          padding: 14,
          flexDirection: 'row',
          gap: 12,
        },
        cardShadow,
      ]}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          backgroundColor: '#f5f5f4',
        }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{ fontSize: 14, fontWeight: '600', color: COLORS.onSurface }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}
        >
          {formatPrice(item.price)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 2,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 20,
              backgroundColor: cfg.bg,
            }}
          >
            <Icon size={11} color={cfg.color} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: cfg.color }}>
              {cfg.label}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: COLORS.secondary }}>
            {item.category}
          </Text>
        </View>
        {item.status === 'rejected' && item.adminFeedback && (
          <Text
            style={{ fontSize: 11, color: '#991b1b', marginTop: 2 }}
            numberOfLines={1}
          >
            ⚠ {item.adminFeedback.reasonCategory}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function MyListingsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<ListingStatus | 'all'>('all');
  const { data, isLoading, isRefetching, refetch } = useMyListings();
  const seedCache = useSeedListingCache();

  const allListings = data?.data ?? [];
  const filtered =
    activeTab === 'all'
      ? allListings
      : allListings.filter(l => l.status === activeTab);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handlePress = useCallback(
    (listing: MyListing) => {
      seedCache(listing);
      navigation.navigate('ListingDetail', { listingId: listing.id });
    },
    [seedCache, navigation],
  );

  if (isLoading) return <MyListingsSkeleton />;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f8' }}>
      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 8,
        }}
        style={{ marginVertical: 14 }}
      >
        {TABS.map(tab => {
          const count =
            tab.value === 'all'
              ? allListings.length
              : allListings.filter(l => l.status === tab.value).length;
          if (count === 0 && tab.value !== 'all') return null;
          const active = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: active ? COLORS.primary : '#edeeed',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: active ? '700' : '500',
                  color: active ? '#fff' : COLORS.secondary,
                }}
              >
                {tab.label}
                {count > 0 ? ` · ${count}` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Listing list */}
      <FlatList
        data={filtered}
        style={{flex: 1}}
        keyExtractor={item => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              paddingTop: 60,
              paddingHorizontal: 40,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: COLORS.onSurface,
                textAlign: 'center',
              }}
            >
              Không có bài đăng nào
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: COLORS.secondary,
                textAlign: 'center',
                marginTop: 6,
              }}
            >
              Nhấn nút + để đăng bán sản phẩm đầu tiên
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard item={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
}
