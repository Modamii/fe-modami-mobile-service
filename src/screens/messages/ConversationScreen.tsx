import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  ChevronLeft,
  Send,
  ImageIcon,
  Phone,
  MoreVertical,
  Check,
  CheckCheck,
} from 'lucide-react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useAuthStore } from '@/store';
import { COLORS } from '@/constants';

type Props = RootStackScreenProps<'Conversation'>;

// ─── Types ──────────────────────────────────────────────────────────────────

type MessageStatus = 'sent' | 'delivered' | 'read';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
  productRef?: { id: string; title: string; price: string; image: string };
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm-001',
    senderId: 'other',
    text: 'Chào bạn! Mình thấy bạn đăng áo blazer xanh navy, áo còn không ạ?',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    status: 'read',
    productRef: {
      id: 'p001',
      title: 'Áo blazer vintage xanh navy',
      price: '350.000₫',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
    },
  },
  {
    id: 'm-002',
    senderId: 'me',
    text: 'Dạ còn bạn nhé! Áo mình mặc khoảng 2 lần, còn rất mới ạ.',
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-003',
    senderId: 'other',
    text: 'Bạn có thể cho mình xem thêm ảnh thực tế không? Đặc biệt phần cổ áo và tay áo ạ',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-004',
    senderId: 'me',
    text: 'Mình gửi ảnh thêm cho bạn nha. Áo form đẹp lắm, mặc vào rất thanh lịch!',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-005',
    senderId: 'other',
    text: 'Ôi đẹp quá! Mình mặc size M có vừa không bạn nhỉ? Mình cao 1m62, nặng 52kg',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-006',
    senderId: 'me',
    text: 'Áo size M vừa với dáng bạn nha! Mình cùng số đo mặc rất ổn. Bạn thích màu này không?',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-007',
    senderId: 'other',
    text: 'Thích lắm ạ! Bạn có ship về Hà Nội không? Ship phí bao nhiêu ạ?',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-008',
    senderId: 'me',
    text: 'Mình ship được ạ! Ship J&T khoảng 30-35k, 2-3 ngày là tới. Bạn muốn đặt không?',
    createdAt: new Date(Date.now() - 7 * 60000).toISOString(),
    status: 'delivered',
  },
  {
    id: 'm-009',
    senderId: 'other',
    text: 'Áo blazer còn không bạn ơi?',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    status: 'read',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function groupByDate(messages: ChatMessage[]): Array<ChatMessage | string> {
  const result: Array<ChatMessage | string> = [];
  let lastDate = '';
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
    if (date !== lastDate) {
      result.push(date);
      lastDate = date;
    }
    result.push(msg);
  });
  return result;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductContextCard({ product }: Readonly<{ product: NonNullable<ChatMessage['productRef']> }>) {
  return (
    <View className="flex-row items-center gap-3 bg-surface rounded-2xl p-3 mx-4 mb-2"
      style={{ shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}>
      <Image source={{ uri: product.image }} className="w-14 h-14 rounded-xl bg-surface-container" resizeMode="cover" />
      <View className="flex-1">
        <Text className="text-xs text-secondary uppercase tracking-widest font-semibold">Cuộc hội thoại về</Text>
        <Text className="text-sm font-bold text-on-surface mt-0.5" numberOfLines={1}>{product.title}</Text>
        <Text className="text-sm text-primary font-semibold mt-0.5">{product.price}</Text>
      </View>
    </View>
  );
}

function StatusIcon({ status }: Readonly<{ status: MessageStatus }>) {
  if (status === 'sent') return <Check size={12} color={COLORS.secondary} strokeWidth={2.5} />;
  if (status === 'delivered') return <CheckCheck size={12} color={COLORS.secondary} strokeWidth={2.5} />;
  return <CheckCheck size={12} color="#60a5fa" strokeWidth={2.5} />;
}

function MessageBubble({ message, isMe }: Readonly<{ message: ChatMessage; isMe: boolean }>) {
  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      className={`flex-row mb-1 px-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <View className={`max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
        <View
          className={`px-4 py-3 rounded-2xl ${
            isMe
              ? 'bg-primary rounded-br-sm'
              : 'bg-surface rounded-bl-sm'
          }`}
          style={isMe ? undefined : { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
        >
          <Text className={`text-sm leading-5 ${isMe ? 'text-white' : 'text-on-surface'}`}>
            {message.text}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 mt-0.5 px-1">
          <Text className="text-[10px] text-secondary">{formatTime(message.createdAt)}</Text>
          {isMe && <StatusIcon status={message.status} />}
        </View>
      </View>
    </Animated.View>
  );
}

function DateDivider({ label }: Readonly<{ label: string }>) {
  return (
    <View className="flex-row items-center gap-3 px-8 py-3">
      <View className="flex-1 h-px bg-surface-container" />
      <Text className="text-[11px] text-secondary font-medium">{label}</Text>
      <View className="flex-1 h-px bg-surface-container" />
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ConversationScreen({ navigation, route }: Props) {
  const { participantName } = route.params;
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const grouped = groupByDate(messages);

  const productRef = messages.find((m) => m.productRef)?.productRef;

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View className="flex-1 bg-background">
      {/* ── Header ── */}
      <View
        className="bg-surface flex-row items-center px-4 pb-3 gap-3 border-b border-surface-container"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft size={24} color={COLORS.onSurface} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Avatar */}
        <View className="relative">
          <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center">
            <Text className="text-base font-bold text-primary">{participantName.charAt(0)}</Text>
          </View>
          {/* Online dot */}
          <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-surface" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-bold text-on-surface">{participantName}</Text>
          <Text className="text-xs text-green-600 font-medium">Đang hoạt động</Text>
        </View>

        <TouchableOpacity hitSlop={12}>
          <Phone size={20} color={COLORS.secondary} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={12}>
          <MoreVertical size={20} color={COLORS.secondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Product context card */}
        {productRef && (
          <View className="pt-3">
            <ProductContextCard product={productRef} />
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={grouped}
          keyExtractor={(item, i) => (typeof item === 'string' ? `date-${i}` : item.id)}
          contentContainerClassName="py-3"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            if (typeof item === 'string') {
              return <DateDivider label={item} />;
            }
            const isMe = item.senderId === 'me';
            return <MessageBubble message={item} isMe={isMe} />;
          }}
        />

        {/* ── Input bar ── */}
        <View
          className="flex-row items-end gap-2 px-4 pt-2 bg-surface border-t border-surface-container"
          style={{ paddingBottom: insets.bottom + 8 }}
        >
          <TouchableOpacity className="pb-2.5" hitSlop={12}>
            <ImageIcon size={22} color={COLORS.secondary} strokeWidth={2} />
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
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-full items-center justify-center mb-0.5 ${inputText.trim() ? 'bg-primary' : 'bg-surface-container'}`}
            style={inputText.trim() ? { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 } : undefined}
          >
            <Send
              size={18}
              color={inputText.trim() ? '#ffffff' : COLORS.secondary}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
