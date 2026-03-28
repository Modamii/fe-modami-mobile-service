import React from 'react';
import { Text } from 'react-native';

export function SectionTitle({ children }: Readonly<{ children: string }>) {
  return (
    <Text className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">
      {children}
    </Text>
  );
}
