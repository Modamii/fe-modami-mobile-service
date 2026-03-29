import React from 'react';
import { View, type ViewStyle } from 'react-native';

interface SkeletonBoxProps {
  width?: number | `${number}%` | 'auto';
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: ViewStyle;
}

/**
 * Static skeleton placeholder (no animation — better perf on low-end devices).
 * Use this as a building block for screen-specific skeletons.
 */
export function SkeletonBox({
  width,
  height = 16,
  borderRadius = 8,
  className,
  style,
}: SkeletonBoxProps) {
  return (
    <View
      style={[{ width, height, borderRadius, backgroundColor: '#e0e0de' }, style]}
      className={className}
    />
  );
}

/** Convenience row of skeleton boxes with horizontal layout */
export function SkeletonRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{children}</View>;
}
