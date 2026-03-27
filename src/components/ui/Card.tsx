import React from 'react';
import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated = false, className, ...props }: CardProps) {
  return (
    <View
      className={`bg-surface rounded-2xl overflow-hidden ${
        elevated ? 'shadow-sm' : ''
      } ${className ?? ''}`}
      style={elevated ? { shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 } : undefined}
      {...props}
    >
      {children}
    </View>
  );
}
