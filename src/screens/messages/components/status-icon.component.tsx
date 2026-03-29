import React from 'react';
import { CheckIcon, CheckBadgeIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';
import type { MessageStatus } from '@/screens/messages/types/chat.types';

type Props = Readonly<{ status: MessageStatus }>;

export function StatusIcon({ status }: Props) {
  if (status === 'sent') return <CheckIcon size={12} color={COLORS.secondary} />;
  if (status === 'delivered') return <CheckBadgeIcon size={12} color={COLORS.secondary} />;
  return <CheckBadgeIcon size={12} color="#60a5fa" />;
}
