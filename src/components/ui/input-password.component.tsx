import React, { forwardRef, useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, type TextInputProps } from 'react-native';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';

interface InputPasswordProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
}

export const InputPassword = forwardRef<TextInput, InputPasswordProps>(
  ({ label, error, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);

    return (
      <View className="gap-1">
        {label && (
          <Text className="text-sm font-medium text-on-surface/70">{label}</Text>
        )}
        <View
          className={`flex-row items-center bg-surface-container rounded-xl px-4 border ${
            error ? 'border-red-400' : focused ? 'border-primary' : 'border-transparent'
          }`}
        >
          <TextInput
            ref={ref}
            className={`flex-1 py-3 text-base text-on-surface ${className ?? ''}`}
            placeholderTextColor={COLORS.secondary}
            secureTextEntry={!visible}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            activeOpacity={0.6}
          >
            {visible ? (
              <EyeSlashIcon size={20} color={COLORS.secondary} />
            ) : (
              <EyeIcon size={20} color={COLORS.secondary} />
            )}
          </TouchableOpacity>
        </View>
        {error && <Text className="text-xs text-red-500">{error}</Text>}
      </View>
    );
  },
);

InputPassword.displayName = 'InputPassword';
