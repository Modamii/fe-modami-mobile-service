import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import type { AuthStackScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { COLORS } from '@/constants/app.constants';
import { useRegisterScreen } from './hooks/useRegisterScreen';
import { AuthBrand } from './components/auth-brand.component';

type Props = AuthStackScreenProps<'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    authError,
    handleRegister,
  } = useRegisterScreen();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-1 mb-5"
            hitSlop={8}
          >
            <ChevronLeftIcon size={18} color={COLORS.primary} />
            <Text className="text-primary font-medium">Quay lại</Text>
          </TouchableOpacity>

          <AuthBrand compact />
          <Text className="text-3xl font-bold text-on-surface tracking-tight mt-3">
            Tạo tài khoản
          </Text>
          <Text className="text-base text-secondary mt-1">
            Bắt đầu hành trình thời trang của bạn
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="Tên hiển thị"
            value={name}
            onChangeText={setName}
            placeholder="Tên của bạn"
            autoCapitalize="words"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            placeholder="Tối thiểu 8 ký tự"
            secureTextEntry
          />

          {authError && (
            <Text className="text-sm text-red-500 text-center">{authError}</Text>
          )}

          <Button onPress={handleRegister} loading={isLoading} className="mt-2">
            Đăng ký
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
