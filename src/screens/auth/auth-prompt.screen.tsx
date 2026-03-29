import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XMarkIcon } from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useAuthStore } from '@/store/app.store';
import { COLORS } from '@/constants/app.constants';
import { LockIcon } from 'lucide-react-native';

type Props = RootStackScreenProps<'AuthPrompt'>;

export function AuthPromptScreen({ navigation, route }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Auto-dismiss when user logs in via the Login screen then comes back here
  useEffect(() => {
    if (isAuthenticated && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [isAuthenticated, navigation]);
  const insets = useSafeAreaInsets();
  const message = route.params?.message ?? 'Đăng nhập để tiếp tục sử dụng tính năng này.';

  return (
    <View className="flex-1 bg-black/40 justify-end">
      <View
        className="bg-surface rounded-t-3xl px-6 pt-6"
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Handle + close */}
        <View className="items-center mb-2">
          <View className="w-10 h-1 rounded-full bg-surface-container" />
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute right-5 top-5"
          hitSlop={12}
        >
          <XMarkIcon size={22} color={COLORS.secondary} />
        </TouchableOpacity>

        {/* Icon */}
        <View className="items-center mt-4 mb-5">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center">
            <LockIcon size={28} color={COLORS.primary} strokeWidth={1.5} />
          </View>
        </View>

        {/* Text */}
        <Text className="text-xl font-bold text-on-surface text-center">
          Cần đăng nhập
        </Text>
        <Text className="text-sm text-secondary text-center mt-2 leading-5">
          {message}
        </Text>

        {/* Buttons */}
        <View className="gap-3 mt-7">
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="bg-primary rounded-2xl py-4 items-center"
            style={Platform.select({
              ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
              android: { elevation: 3 },
            })}
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            className="bg-surface-container rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-on-surface font-semibold text-base">Tạo tài khoản mới</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="py-3 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-secondary text-sm">Bỏ qua, tiếp tục xem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
