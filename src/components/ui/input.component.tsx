import React, { forwardRef, useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, type TextInputProps } from 'react-native';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, style, secureTextEntry, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const isPassword = secureTextEntry !== undefined && secureTextEntry !== false;

    const borderColor = error ? '#f87171' : focused ? COLORS.primary : '#e0e0de';

    return (
      <View className="gap-1">
        {label && (
          <Text className="text-sm font-medium text-on-surface/70">{label}</Text>
        )}

        <View>
          <TextInput
            ref={ref}
            className={`h-[50px] bg-surface-container rounded-xl px-4 text-[15px] text-on-surface border ${
              isPassword ? 'pr-11' : ''
            }`}
            style={[{ borderColor }, style]}
            placeholderTextColor={COLORS.secondary}
            textAlignVertical="center"
            secureTextEntry={isPassword && !passwordVisible}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setPasswordVisible((v) => !v)}
              className="absolute right-[14px] top-0 bottom-0 justify-center"
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              activeOpacity={0.6}
            >
              {passwordVisible ? (
                <EyeSlashIcon size={20} color={COLORS.secondary} />
              ) : (
                <EyeIcon size={20} color={COLORS.secondary} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {error && <Text className="text-xs text-red-500">{error}</Text>}
      </View>
    );
  },
);

Input.displayName = 'Input';
