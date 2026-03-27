import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useNotificationStore } from '@/store/app.store';
import { timeAgo } from '@/lib/utils.helper';

type Props = RootStackScreenProps<'Notifications'>;

const typeLabel: Record<string, string> = {
  like: '❤️',
  comment: '💬',
  follow: '👤',
  sale: '💰',
  system: '📢',
};

export function NotificationsScreen(_props: Props) {
  const { notifications, markAllRead, markRead } = useNotificationStore();

  useEffect(() => {
    return () => markAllRead();
  }, [markAllRead]);

  return (
    <FlatList
      data={notifications}
      className="flex-1 bg-background"
      contentContainerClassName="py-2"
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => markRead(item.id)}
          className={`flex-row items-start gap-3 px-5 py-4 ${
            !item.isRead ? 'bg-primary/5' : ''
          }`}
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
