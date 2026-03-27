import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Infinity } from 'lucide-react-native';
import { useCreditStore } from '@/store/app.store';
import { formatCredits } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';

interface CreditChipProps {
  onPress?: () => void;
}

export function CreditChip({ onPress }: CreditChipProps) {
  const balance = useCreditStore((s) => s.balance);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center gap-1 bg-primary-container/20 rounded-full px-3 py-1.5"
    >
      <Infinity size={14} color={COLORS.primary} strokeWidth={2.5} />
      <Text className="text-sm font-semibold text-primary">
        {formatCredits(balance)}
      </Text>
    </TouchableOpacity>
  );
}
