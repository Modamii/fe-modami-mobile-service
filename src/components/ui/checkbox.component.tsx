import React from 'react';
import { TouchableOpacity, View, Text, type TouchableOpacityProps } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/solid';
import { COLORS } from '@/constants/app.constants';

interface CheckboxProps extends Omit<TouchableOpacityProps, 'onPress'> {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label?: string;
  error?: string;
}

export function Checkbox({ checked, onToggle, label, error, disabled, ...props }: CheckboxProps) {
  return (
    <View className="gap-1">
      <TouchableOpacity
        className="flex-row items-center gap-3"
        onPress={() => onToggle(!checked)}
        disabled={disabled}
        activeOpacity={0.7}
        {...props}
      >
        <View
          className={`w-5 h-5 rounded-md items-center justify-center border ${
            checked ? 'bg-primary border-primary' : 'bg-surface border-outline'
          } ${disabled ? 'opacity-40' : ''}`}
          style={
            !checked
              ? {
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 1,
                }
              : undefined
          }
        >
          {checked && <CheckIcon size={12} color="white" />}
        </View>
        {label && (
          <Text className={`text-sm text-on-surface flex-1 ${disabled ? 'opacity-40' : ''}`}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
      {error && <Text className="text-xs text-red-500 ml-8">{error}</Text>}
    </View>
  );
}
