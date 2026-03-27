import React from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { CATEGORIES, COLORS } from '@/constants/app.constants';

const CATEGORY_EMOJI: Record<string, string> = {
  Tops: '👕',
  Bottoms: '👖',
  Dresses: '👗',
  Outerwear: '🧥',
  Shoes: '👟',
  Bags: '👜',
  Accessories: '💍',
};

type ChipValue = string | null;

interface CategoryChipsProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const data: ChipValue[] = [null, ...CATEGORIES];

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item ?? 'all'}
      contentContainerClassName="gap-2 pr-2"
      renderItem={({ item }) => {
        const isActive = selected === item;
        return (
          <TouchableOpacity
            onPress={() => onSelect(isActive ? null : item)}
            className={`flex-row items-center gap-1.5 rounded-full px-4 py-2 ${
              isActive ? 'bg-primary' : 'bg-surface'
            }`}
            style={isActive ? undefined : styles.chipShadow}
          >
            {item && <Text style={styles.emoji}>{CATEGORY_EMOJI[item]}</Text>}
            <Text
              className={`text-sm font-semibold ${
                isActive ? 'text-white' : 'text-secondary'
              }`}
            >
              {item ?? 'Tất cả'}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  chipShadow: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  emoji: {
    fontSize: 12,
  },
});
