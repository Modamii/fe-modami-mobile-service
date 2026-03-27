import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { HomeCategory } from '@/types/app.type';

interface CategoryItemProps {
  item: HomeCategory;
  onPress: (category: string) => void;
}

export function CategoryItem({ item, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.category)}
      activeOpacity={0.88}
      style={styles.container}
      className="rounded-2xl overflow-hidden bg-surface-container"
    >
      <Image
        source={{ uri: item.image }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-primary/25 items-center justify-center">
        <Text className="text-white font-bold text-lg uppercase tracking-widest">
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
  },
});
