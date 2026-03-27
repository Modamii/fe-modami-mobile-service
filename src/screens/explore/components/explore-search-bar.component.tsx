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
}

export function ExploreSearchBar({
  value,
  onChangeText,
  onClear,
  hasActiveFilter,
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
      <TouchableOpacity hitSlop={8}>
        <AdjustmentsHorizontalIcon
          size={18}
          color={hasActiveFilter ? COLORS.primary : COLORS.secondary}
        />
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
