import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';

interface ExploreSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  hasActiveFilter: boolean;
  onFilterPress: () => void;
}

export function ExploreSearchBar({
  value,
  onChangeText,
  onClear,
  hasActiveFilter,
  onFilterPress,
}: ExploreSearchBarProps) {
  return (
    <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 gap-2" style={styles.shadow}>
      <MagnifyingGlassIcon size={18} color={COLORS.secondary} />
      <TextInput
        className="flex-1 text-base text-on-surface"
        placeholder="Tìm thương hiệu, sản phẩm..."
        placeholderTextColor={COLORS.secondary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <XMarkIcon size={16} color={COLORS.secondary} />
        </TouchableOpacity>
      ) : (
        <View className="h-5 w-px bg-surface-container" />
      )}
      <TouchableOpacity onPress={onFilterPress} hitSlop={8}>
        {hasActiveFilter ? (
          <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
            <AdjustmentsHorizontalIcon size={13} color="#fff" />
          </View>
        ) : (
          <AdjustmentsHorizontalIcon size={18} color={COLORS.secondary} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
});
