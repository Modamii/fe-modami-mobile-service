import React, { forwardRef, useState } from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { COLORS } from '@/constants/app.constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <View className="gap-1">
        {label && (
          <Text className="text-sm font-medium text-on-surface/70">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`bg-surface-container rounded-xl px-4 py-3 text-base text-on-surface ${
            focused ? 'border border-primary' : 'border border-transparent'
          } ${error ? 'border-red-400' : ''} ${className ?? ''}`}
          placeholderTextColor={COLORS.secondary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {error && (
          <Text className="text-xs text-red-500">{error}</Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
