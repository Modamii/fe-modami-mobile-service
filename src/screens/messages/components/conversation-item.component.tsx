import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { timeAgo } from '@/lib/utils.helper';
import type { Conversation } from '@/types/app.type';

type Props = Readonly<{
  item: Conversation;
  onPress: () => void;
}>;

export function ConversationItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3 gap-3"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.participantAvatar }}
        className="w-12 h-12 rounded-full bg-surface-container"
      />
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-on-surface">{item.participantName}</Text>
          <Text className="text-xs text-secondary">{timeAgo(item.lastMessageAt)}</Text>
        </View>
        <Text className="text-sm text-secondary mt-0.5" numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View className="bg-primary rounded-full w-5 h-5 items-center justify-center">
          <Text className="text-white text-xs font-bold">{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
