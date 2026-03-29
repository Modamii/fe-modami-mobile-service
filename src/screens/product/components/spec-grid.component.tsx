import React from 'react';
import { View, Text } from 'react-native';

type SpecRow = {
  label: string;
  value: string;
};

type Props = Readonly<{
  rows: SpecRow[];
}>;

export function SpecGrid({ rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2">
      {rows.map((row) => (
        <View key={row.label} className="w-[48%] grow bg-surface-container rounded-xl p-3">
          <Text className="text-[10px] font-semibold text-secondary uppercase tracking-wide mb-1">
            {row.label}
          </Text>
          <Text className="text-sm font-semibold text-on-surface leading-5">{row.value}</Text>
        </View>
      ))}
    </View>
  );
}
