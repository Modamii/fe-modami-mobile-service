import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/queries/notification.queries';
import { timeAgo } from '@/lib/utils.helper';
import { NotificationsSkeleton } from './notifications-skeleton.component';
import { COLORS } from '@/constants/app.constants';

type Props = RootStackScreenProps<'Notifications'>;

const typeLabel: Record<string, string> = {
  like: '❤️',
  comment: '💬',
  follow: '👤',
  sale: '💰',
  system: '📢',
};

export function NotificationsScreen(_props: Props) {
  const { data, isLoading, isRefetching, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) return <NotificationsSkeleton />;

  return (
    <FlatList
      data={notifications}
      className="flex-1 bg-background"
      contentContainerClassName="py-2"
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
      ListHeaderComponent={
        notifications.some((n) => !n.isRead) ? (
          <TouchableOpacity
            onPress={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="mx-5 mb-2 self-end"
            hitSlop={8}
          >
            <Text className="text-xs font-semibold text-primary">
              {markAllRead.isPending ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
            </Text>
          </TouchableOpacity>
        ) : null
      }
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-secondary text-sm">Chưa có thông báo nào</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            if (!item.isRead) markRead.mutate(item.id);
          }}
          className={`flex-row items-start gap-3 px-5 py-4 ${!item.isRead ? 'bg-primary/5' : ''}`}
          activeOpacity={0.7}
        >
          <View className="w-9 h-9 rounded-full bg-surface-container items-center justify-center">
            <Text className="text-lg">{typeLabel[item.type] ?? '📢'}</Text>
          </View>
          <View className="flex-1">
            <Text className={`text-sm ${!item.isRead ? 'font-semibold text-on-surface' : 'text-secondary'}`}>
              {item.title}
            </Text>
            <Text className="text-sm text-secondary mt-0.5">{item.body}</Text>
            <Text className="text-xs text-secondary/60 mt-1">{timeAgo(item.createdAt)}</Text>
          </View>
          {!item.isRead && (
            <View className="w-2 h-2 rounded-full bg-primary mt-1.5" />
          )}
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View className="h-px bg-surface-container" />}
    />
  );
}
