import React from 'react';
import { View, Text } from 'react-native';

type Props = Readonly<{ label: string }>;

export function DateDivider({ label }: Props) {
  return (
    <View className="flex-row items-center gap-3 px-8 py-3">
      <View className="flex-1 h-px bg-surface-container" />
      <Text className="text-[11px] text-secondary font-medium">{label}</Text>
      <View className="flex-1 h-px bg-surface-container" />
    </View>
  );
}
