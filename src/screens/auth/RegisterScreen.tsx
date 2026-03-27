import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import type { AuthStackScreenProps } from '@/navigation/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store';
import logo from '@/assets/logos/modami-logo-text.webp';

type Props = AuthStackScreenProps<'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, authError, clearAuthError } = useAuthStore();

  const handleRegister = async () => {
    clearAuthError();
    await register(email, password, name);
  };

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
          <TouchableOpacity onPress={() => navigation.goBack()} className="mb-5">
            <Text className="text-primary font-medium">← Quay lại</Text>
          </TouchableOpacity>
          <Image
            source={logo}
            style={{ width: 160, height: 48 }}
            resizeMode="contain"
            className="mb-3"
          />
          <Text className="text-3xl font-bold text-on-surface tracking-tight">Tạo tài khoản</Text>
          <Text className="text-base text-secondary mt-1">Bắt đầu hành trình thời trang của bạn</Text>
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
