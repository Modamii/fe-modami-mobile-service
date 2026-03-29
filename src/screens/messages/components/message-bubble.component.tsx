import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { COLORS } from '@/constants/app.constants';
import type { ChatMessage } from '@/screens/messages/types/chat.types';
import { StatusIcon } from './status-icon.component';
import { formatTime } from '../helpers/chat.helpers';

type Props = Readonly<{ message: ChatMessage; isMe: boolean }>;

export function MessageBubble({ message, isMe }: Props) {
  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      className={`flex-row mb-1 px-4 ${isMe ? 'justify-end' : 'justify-start'}`}
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
