import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CheckCircleIcon, TruckIcon, StarIcon, ShoppingBagIcon } from 'react-native-heroicons/outline';
import { StarIcon as StarSolid } from 'react-native-heroicons/solid';
import { COLORS } from '@/constants/app.constants';
import type { ChatMessage } from '@/screens/messages/types/chat.types';
import { StatusIcon } from './status-icon.component';
import { formatTime } from '../helpers/chat.helpers';

type Props = Readonly<{ message: ChatMessage; isMe: boolean }>;

// ─── System log (centered info text, like group chat events) ─────────────────

function SystemLog({ text }: { text: string }) {
  return (
    <Animated.View entering={FadeInUp.duration(250)} className="items-center px-6 my-2">
      <View className="bg-surface-container rounded-full px-4 py-1.5">
        <Text className="text-[11px] text-secondary text-center">{text}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Special system cards ─────────────────────────────────────────────────────

function OrderConfirmCard({ message }: { message: ChatMessage }) {
  const order = message.orderRef!;
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Animated.View entering={FadeInUp.duration(200)} className="mx-4 mb-4">
      <View className="rounded-2xl overflow-hidden border border-primary/20 bg-primary/5">
        <View className="flex-row items-center gap-2 bg-primary/10 px-4 py-3">
          <ShoppingBagIcon size={16} color={COLORS.primary} />
          <Text className="text-xs font-bold text-primary uppercase tracking-wide">Xác nhận đặt hàng</Text>
        </View>
        <View className="px-4 py-4 gap-3">
          <Text className="text-sm font-semibold text-on-surface" numberOfLines={1}>{order.productTitle}</Text>
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-secondary">Mã đơn hàng</Text>
              <Text className="text-xs font-bold text-on-surface">#{order.orderId}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-secondary">Tổng tiền</Text>
              <Text className="text-sm font-bold text-primary">{order.amount}</Text>
            </View>
            {order.address ? (
              <View className="flex-row justify-between items-start gap-2">
                <Text className="text-xs text-secondary shrink-0">Địa chỉ nhận</Text>
                <Text className="text-xs text-on-surface text-right flex-1">{order.address}</Text>
              </View>
            ) : null}
          </View>

          {confirmed ? (
            <View className="flex-row items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5">
              <CheckCircleIcon size={14} color="#16a34a" />
              <Text className="text-xs text-green-700 font-semibold">Đơn hàng đã được xác nhận</Text>
            </View>
          ) : (
            <View className="flex-row gap-2 mt-1">
              <TouchableOpacity
                className="flex-1 bg-primary rounded-xl py-3 items-center"
                onPress={() => setConfirmed(true)}
              >
                <Text className="text-white text-xs font-semibold">Xác nhận đặt hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 border border-surface-container rounded-xl py-3 items-center"
                onPress={() => {}}
              >
                <Text className="text-secondary text-xs font-semibold">Huỷ đơn</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text className="text-[10px] text-secondary mt-1 px-1 text-center">{formatTime(message.createdAt)}</Text>
      {confirmed && <SystemLog text={`Đơn hàng #${order.orderId} đã được xác nhận`} />}
    </Animated.View>
  );
}

function OrderShippedCard({ message }: { message: ChatMessage }) {
  const order = message.orderRef!;
  return (
    <Animated.View entering={FadeInUp.duration(200)} className="mx-4 mb-4">
      <View className="rounded-2xl overflow-hidden border border-blue-200 bg-blue-50">
        <View className="flex-row items-center gap-2 bg-blue-100 px-4 py-3">
          <TruckIcon size={16} color="#2563eb" />
          <Text className="text-xs font-bold text-blue-700 uppercase tracking-wide">Đang giao hàng</Text>
        </View>
        <View className="px-4 py-4 gap-3">
          <Text className="text-sm font-semibold text-on-surface" numberOfLines={1}>{order.productTitle}</Text>
          <View className="gap-2">
            {order.carrier ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-secondary">Đơn vị vận chuyển</Text>
                <Text className="text-xs font-bold text-on-surface">{order.carrier}</Text>
              </View>
            ) : null}
            {order.trackingCode ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-secondary">Mã vận đơn</Text>
                <Text className="text-xs font-bold text-blue-600">{order.trackingCode}</Text>
              </View>
            ) : null}
          </View>
          <Text className="text-xs text-secondary">Dự kiến giao trong 2–3 ngày làm việc.</Text>
        </View>
      </View>
      <Text className="text-[10px] text-secondary mt-1 px-1 text-center">{formatTime(message.createdAt)}</Text>
    </Animated.View>
  );
}

function OrderReceivedCard({ message }: { message: ChatMessage }) {
  const order = message.orderRef!;
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Animated.View entering={FadeInUp.duration(200)} className="mx-4 mb-4">
      <View className="rounded-2xl overflow-hidden border border-green-200 bg-green-50">
        <View className="flex-row items-center gap-2 bg-green-100 px-4 py-3">
          <CheckCircleIcon size={16} color="#16a34a" />
          <Text className="text-xs font-bold text-green-700 uppercase tracking-wide">Đã nhận hàng</Text>
        </View>
        <View className="px-4 py-4 gap-3">
          <Text className="text-sm font-semibold text-on-surface" numberOfLines={1}>{order.productTitle}</Text>
          <Text className="text-xs text-secondary">Mã đơn #{order.orderId} đã hoàn tất thành công.</Text>

          {confirmed ? (
            <View className="flex-row items-center gap-2 bg-green-100 rounded-xl px-3 py-2.5">
              <CheckCircleIcon size={14} color="#16a34a" />
              <Text className="text-xs text-green-700 font-semibold">Đã xác nhận nhận hàng thành công</Text>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-green-600 rounded-xl py-3 items-center"
              onPress={() => setConfirmed(true)}
            >
              <Text className="text-white text-sm font-semibold text-center">Xác nhận đã nhận hàng</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text className="text-[10px] text-secondary mt-1 px-1 text-center">{formatTime(message.createdAt)}</Text>
      {confirmed && <SystemLog text={`Bạn đã xác nhận nhận hàng · Đơn #${order.orderId}`} />}
    </Animated.View>
  );
}

function ReviewRequestCard({ message }: { message: ChatMessage }) {
  const review = message.reviewRef!;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Animated.View entering={FadeInUp.duration(200)} className="mx-4 mb-4">
      <View className="rounded-2xl overflow-hidden border border-yellow-200 bg-yellow-50">
        <View className="flex-row items-center gap-2 bg-yellow-100 px-4 py-3">
          <StarIcon size={16} color="#ca8a04" />
          <Text className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Đánh giá người bán</Text>
        </View>
        <View className="px-4 py-4 gap-3">
          <Text className="text-sm text-on-surface">
            Bạn đã mua <Text className="font-semibold">"{review.productTitle}"</Text> từ{' '}
            <Text className="font-semibold text-primary">{review.sellerName}</Text>. Hãy để lại đánh giá để giúp cộng đồng nhé!
          </Text>

          {submitted ? (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <CheckCircleIcon size={16} color="#16a34a" />
                <Text className="font-semibold text-green-700">Cảm ơn bạn đã đánh giá!</Text>
              </View>
              <View className="flex-row gap-1.5">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= rating ? (
                    <StarSolid key={star} size={20} color="#f59e0b" />
                  ) : (
                    <StarSolid key={star} size={20} color="#d1d5db" />
                  ),
                )}
              </View>
            </View>
          ) : (
            <>
              <View className="flex-row gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)} hitSlop={4}>
                    {star <= rating ? (
                      <StarSolid size={32} color="#f59e0b" />
                    ) : (
                      <StarIcon size={32} color="#d1d5db" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={200}
                className="bg-white border border-surface-container rounded-xl px-3 py-2.5 text-sm text-on-surface"
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />

              <TouchableOpacity
                className={`rounded-xl py-3 items-center ${rating > 0 ? 'bg-yellow-400' : 'bg-surface-container'}`}
                onPress={() => { if (rating > 0) setSubmitted(true); }}
                disabled={rating === 0}
              >
                <Text className={`text-sm font-semibold ${rating > 0 ? 'text-on-surface' : 'text-secondary'}`}>
                  Gửi đánh giá
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <Text className="text-[10px] text-secondary mt-1 px-1 text-center">{formatTime(message.createdAt)}</Text>
      {submitted && (
        <SystemLog
          text={`Bạn đã đánh giá ${review.sellerName} · ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`}
        />
      )}
    </Animated.View>
  );
}

// ─── Main bubble ──────────────────────────────────────────────────────────────

export function MessageBubble({ message, isMe }: Props) {
  const type = message.type ?? 'text';

  if (type === 'order_confirm') return <OrderConfirmCard message={message} />;
  if (type === 'order_shipped') return <OrderShippedCard message={message} />;
  if (type === 'order_received') return <OrderReceivedCard message={message} />;
  if (type === 'review_request') return <ReviewRequestCard message={message} />;

  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      className={`flex-row mb-2 px-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <View className={`max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
        <View
          className={`px-4 py-3 rounded-2xl ${
            isMe ? 'bg-primary rounded-br-sm' : 'bg-surface rounded-bl-sm'
          }`}
          style={
            isMe
              ? undefined
              : {
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }
          }
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
