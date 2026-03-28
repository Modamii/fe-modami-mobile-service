import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/app.constants';

type Props = Readonly<{
  options: readonly string[];
  selected: string | null;
  onSelect: (v: string) => void;
  labelMap?: Record<string, string>;
}>;

export function ChipPicker({ options, selected, onSelect, labelMap }: Props) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            className={`rounded-full px-4 py-2 ${isSelected ? 'bg-primary' : 'bg-surface'}`}
            style={
              isSelected
                ? undefined
                : {
                    shadowColor: COLORS.onSurface,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 1,
                  }
            }
          >
            <Text
              className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-secondary'}`}
            >
              {labelMap ? (labelMap[opt] ?? opt) : opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
