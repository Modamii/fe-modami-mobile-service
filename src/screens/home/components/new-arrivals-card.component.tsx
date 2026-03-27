import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { Product } from '@/types/app.type';
import { formatPriceShort } from '@/lib/utils.helper';

interface NewArrivalsCardProps {
  item: Product;
  onPress: () => void;
}

export function NewArrivalsCard({ item, onPress }: NewArrivalsCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      style={styles.card}
      className="rounded-3xl overflow-hidden bg-surface-container"
    >
      <Image
        source={{ uri: item.images[0] }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Gradient simulation: stacked semi-transparent overlays */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={{ flex: 3 }} />
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)' }} />
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.38)' }} />
      </View>

      {/* Text content */}
      <View style={styles.textOverlay}>
        <Text className="text-white font-bold text-lg leading-tight" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-white/80 text-xs font-semibold uppercase tracking-widest mt-1">
          {item.size ? `Size ${item.size} • ` : ''}{formatPriceShort(item.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 272,
    aspectRatio: 4 / 5,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
});
