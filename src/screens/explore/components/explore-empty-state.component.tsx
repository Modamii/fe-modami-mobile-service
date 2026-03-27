import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ExploreEmptyStateProps {
  onClearFilters: () => void;
}

export function ExploreEmptyState({ onClearFilters }: ExploreEmptyStateProps) {
  return (
    <View className="items-center justify-center py-20 gap-3">
      <Text className="text-4xl">🔍</Text>
      <Text className="text-on-surface font-semibold">Không tìm thấy kết quả</Text>
      <Text className="text-secondary text-sm text-center px-10">
        Thử tìm kiếm với từ khoá khác hoặc bỏ bộ lọc
      </Text>
      <TouchableOpacity
        onPress={onClearFilters}
        className="bg-primary/10 rounded-full px-4 py-2"
      >
        <Text className="text-primary text-sm font-semibold">Xoá bộ lọc</Text>
      </TouchableOpacity>
    </View>
  );
}
