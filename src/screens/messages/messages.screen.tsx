import React, { useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { useAuthStore } from '@/store/app.store';
import { useConversations } from '@/hooks/queries/conversation.queries';
import { COLORS } from '@/constants/app.constants';
import { ConversationItem } from './components/conversation-item.component';
import { MessagesScreenSkeleton } from './components/messages-skeleton.component';
import { MessageCircleIcon } from 'lucide-react-native';

type Props = MainTabScreenProps<'Messages'>;

export function MessagesScreen({ navigation }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading, isRefetching, refetch } = useConversations();

  const conversations = data?.data ?? [];

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="px-5 py-4">
          <Text className="text-2xl font-bold text-on-surface tracking-tight">Tin nhắn</Text>
        </View>
        <View className="flex-1 items-center justify-center px-8 gap-5">
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center">
            <MessageCircleIcon size={40} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <View className="items-center gap-2">
            <Text className="text-lg font-bold text-on-surface text-center">Cần đăng nhập</Text>
            <Text className="text-sm text-secondary text-center leading-5">
              Đăng nhập để nhắn tin với người mua và người bán.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="bg-primary rounded-2xl px-8 py-4 w-full items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) return <MessagesScreenSkeleton />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 py-4">
        <Text className="text-2xl font-bold text-on-surface tracking-tight">Tin nhắn</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 gap-1"
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
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-secondary text-sm">Chưa có tin nhắn nào</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ConversationItem
            item={item}
            onPress={() =>
              navigation.navigate('Conversation', {
                conversationId: item.id,
                participantName: item.participantName,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-surface-container" />
        )}
      />
    </SafeAreaView>
  );
}
