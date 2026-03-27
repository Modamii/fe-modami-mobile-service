import React from 'react';
import { View, Text } from 'react-native';

export function AuthDivider() {
  return (
    <View className="flex-row items-center gap-3 my-2">
      <View className="flex-1 h-px bg-surface-container" />
      <Text className="text-xs text-secondary">hoặc</Text>
      <View className="flex-1 h-px bg-surface-container" />
    </View>
  );
}
