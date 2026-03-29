import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/app.constants';

type Gender = 'male' | 'female' | 'other' | 'undisclosed';

const OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
  { value: 'undisclosed', label: 'Không tiết lộ' },
];

interface GenderPickerProps {
  value?: Gender;
  onChange: (value: Gender | undefined) => void;
  label?: string;
}

export function GenderPicker({ value, onChange, label = 'Giới tính' }: GenderPickerProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-on-surface/70">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {OPTIONS.map(opt => {
          const active = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(active ? undefined : opt.value)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: active ? COLORS.primary : '#f5f5f4',
                borderWidth: active ? 0 : 1,
                borderColor: '#e0e0de',
              }}
              activeOpacity={0.75}
            >
              <Text
                className="text-sm font-medium"
                style={{ color: active ? '#fff' : COLORS.secondary }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
