import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
} from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { COLORS } from '@/constants/app.constants';
import { useMessages, useSendMessage } from '@/hooks/queries/conversation.queries';
import { groupByDate } from './helpers/chat.helpers';
import { ProductContextCard } from './components/product-context-card.component';
import { MessageBubble } from './components/message-bubble.component';
import { DateDivider } from './components/date-divider.component';
import type { ChatMessage } from './types/chat.types';

type Props = RootStackScreenProps<'Conversation'>;

export function ConversationScreen({ navigation, route }: Props) {
  const { conversationId, participantName } = route.params;
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');

  const { data, isLoading, isRefetching, refetch } = useMessages(conversationId);
  const sendMutation = useSendMessage();

  const messages: ChatMessage[] = data?.data ?? [];
  const grouped = groupByDate(messages);
  const productRef = messages.find((m) => m.productRef)?.productRef;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || sendMutation.isPending) return;

    setInputText('');
    sendMutation.mutate({ conversationId, text });
  }, [inputText, conversationId, sendMutation]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ── */}
      <View
        className="bg-surface flex-row items-center px-4 pb-3 gap-3 border-b border-surface-container"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeftIcon size={24} color={COLORS.onSurface} />
        </TouchableOpacity>

        <View className="relative">
          <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center">
            <Text className="text-base font-bold text-primary">{participantName.charAt(0)}</Text>
          </View>
          <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-surface" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-bold text-on-surface">{participantName}</Text>
          <Text className="text-xs text-green-600 font-medium">Đang hoạt động</Text>
        </View>

        <TouchableOpacity hitSlop={12}>
          <PhoneIcon size={20} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={12}>
          <EllipsisVerticalIcon size={20} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {productRef && (
          <View className="pt-3">
            <ProductContextCard product={productRef} />
          </View>
        )}

        {isLoading ? (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text className="text-sm text-secondary">Đang tải tin nhắn...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={grouped}
            keyExtractor={(item, i) => (typeof item === 'string' ? `date-${i}` : item.id)}
            contentContainerClassName="py-3"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            renderItem={({ item }) => {
              if (typeof item === 'string') return <DateDivider label={item} />;
              return <MessageBubble message={item} isMe={item.senderId === 'me'} />;
            }}
          />
        )}

        {/* ── Input bar ── */}
        <View
          className="flex-row items-end gap-2 px-4 pt-2 bg-surface border-t border-surface-container"
          style={{ paddingBottom: insets.bottom + 8 }}
        >
          <TouchableOpacity className="pb-2.5" hitSlop={12}>
            <PhotoIcon size={22} color={COLORS.secondary} />
          </TouchableOpacity>

          <View className="flex-1 bg-surface-low rounded-2xl px-4 py-2.5 min-h-[44px] justify-center">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Nhắn tin..."
              placeholderTextColor={COLORS.secondary}
              className="text-sm text-on-surface"
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || sendMutation.isPending}
            className={`w-10 h-10 rounded-full items-center justify-center mb-0.5 ${
              inputText.trim() && !sendMutation.isPending ? 'bg-primary' : 'bg-surface-container'
            }`}
            style={
              inputText.trim() && !sendMutation.isPending
                ? { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }
                : undefined
            }
          >
            {sendMutation.isPending ? (
              <ActivityIndicator size="small" color={COLORS.secondary} />
            ) : (
              <PaperAirplaneIcon
                size={18}
                color={inputText.trim() ? '#ffffff' : COLORS.secondary}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
