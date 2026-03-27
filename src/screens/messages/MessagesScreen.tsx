import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '@/navigation/types';
import { timeAgo } from '@/lib/utils';
import type { Conversation } from '@/types';

type Props = MainTabScreenProps<'Messages'>;

const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participantId: 'user-002',
    participantName: 'Thu Hà',
    participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    lastMessage: 'Áo blazer còn không bạn ơi?',
    lastMessageAt: new Date(Date.now() - 15 * 60000).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'conv-002',
    participantId: 'user-003',
    participantName: 'Bảo Châu',
    participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    lastMessage: 'Cảm ơn bạn nhé!',
    lastMessageAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    unreadCount: 0,
  },
];

export function MessagesScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4">
        <Text className="text-2xl font-bold text-on-surface tracking-tight">Tin nhắn</Text>
      </View>

      <FlatList
        data={mockConversations}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 gap-1"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Conversation', {
                conversationId: item.id,
                participantName: item.participantName,
              })
            }
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
        )}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-surface-container mx-0" />
        )}
      />
    </SafeAreaView>
  );
}
