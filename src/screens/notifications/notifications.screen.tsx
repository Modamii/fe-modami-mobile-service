import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, RefreshControl, Image } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/queries/notification.queries';
import { timeAgo } from '@/lib/utils.helper';
import { NotificationsSkeleton } from './notifications-skeleton.component';
import { COLORS } from '@/constants/app.constants';
import type { Notification } from '@/types/app.type';

type Props = RootStackScreenProps<'Notifications'>;

type FilterType = 'all' | 'activity' | 'sale' | 'system' | 'news';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hoạt động', value: 'activity' },
  { label: 'Mua bán', value: 'sale' },
  { label: 'Hệ thống', value: 'system' },
  { label: 'Tin tức', value: 'news' },
];

const TYPE_ICON: Record<string, string> = {
  like: '❤️',
  comment: '💬',
  follow: '👤',
  sale: '💰',
  system: '📢',
  news: '📰',
};

const TYPE_BG: Record<string, string> = {
  like: '#fdf4ff',
  comment: '#eff6ff',
  follow: '#f0fdf4',
  sale: '#fef3c7',
  system: '#f0fdf4',
  news: '#eff6ff',
};

function matchesFilter(n: Notification, filter: FilterType): boolean {
  if (filter === 'all') return true;
  if (filter === 'activity') return ['like', 'comment', 'follow'].includes(n.type);
  if (filter === 'sale') return n.type === 'sale';
  if (filter === 'system') return n.type === 'system';
  if (filter === 'news') return n.type === 'news';
  return true;
}

function hasDetail(n: Notification): boolean {
  return !!n.detail || n.type === 'system' || n.type === 'news';
}

export function NotificationsScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { data, isLoading, isRefetching, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const allNotifications = data?.data ?? [];
  const filtered = allNotifications.filter((n) => matchesFilter(n, activeFilter));
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const onRefresh = useCallback(async () => { await refetch(); }, [refetch]);

  const handlePress = useCallback((item: Notification) => {
    if (!item.isRead) markRead.mutate(item.id);
    if (hasDetail(item)) {
      navigation.navigate('NotificationDetail', { notificationId: item.id });
    }
  }, [markRead, navigation]);

  if (isLoading) return <NotificationsSkeleton />;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f8' }}>
      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 12 }}
        style={{ flexGrow: 0 }}
      >
        {FILTERS.map((f) => {
          const count = f.value === 'all'
            ? unreadCount
            : allNotifications.filter((n) => !n.isRead && matchesFilter(n, f.value)).length;
          const active = activeFilter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: active ? COLORS.primary : '#edeeed',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: active ? '700' : '500', color: active ? '#fff' : COLORS.secondary }}>
                {f.label}
              </Text>
              {count > 0 && (
                <View style={{ backgroundColor: active ? 'rgba(255,255,255,0.3)' : COLORS.primary, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />
        }
        ListHeaderComponent={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              style={{ alignSelf: 'flex-end', marginHorizontal: 20, marginBottom: 4 }}
              hitSlop={8}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.primary }}>
                {markAllRead.isPending ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
              </Text>
            </TouchableOpacity>
          ) : null
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ color: COLORS.secondary, fontSize: 14 }}>Không có thông báo nào</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#edeeed' }} />}
        renderItem={({ item }) => {
          const isClickable = hasDetail(item);
          return (
            <TouchableOpacity
              onPress={() => handlePress(item)}
              activeOpacity={isClickable ? 0.7 : 0.95}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
                paddingHorizontal: 20,
                paddingVertical: 14,
                backgroundColor: item.isRead ? 'transparent' : `${COLORS.primary}08`,
              }}
            >
              {/* Avatar or icon */}
              {item.avatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#edeeed' }}
                />
              ) : (
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TYPE_BG[item.type] ?? '#edeeed', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>{TYPE_ICON[item.type] ?? '📢'}</Text>
                </View>
              )}

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: item.isRead ? '400' : '600', color: item.isRead ? COLORS.secondary : COLORS.onSurface, lineHeight: 18 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 13, color: COLORS.secondary, marginTop: 2, lineHeight: 18 }} numberOfLines={2}>
                  {item.body}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Text style={{ fontSize: 11, color: `${COLORS.secondary}99` }}>{timeAgo(item.createdAt)}</Text>
                  {isClickable && (
                    <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '600' }}>Xem chi tiết →</Text>
                  )}
                </View>
              </View>

              {!item.isRead && (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 4 }} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
