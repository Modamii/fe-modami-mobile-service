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
import type { AuthStackScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { useAuthStore } from '@/store/app.store';
import logo from '@/assets/logos/modami-logo-text.webp';

type Props = AuthStackScreenProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithOAuth, isLoading, authError, clearAuthError } = useAuthStore();

  const handleLogin = async () => {
    clearAuthError();
    await login(email, password);
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
        {/* Brand */}
        <View className="mb-10">
          <Image
            source={logo}
            style={{ width: 200, height: 60 }}
            resizeMode="contain"
          />
          <Text className="text-base text-secondary mt-3">Thời trang bền vững, phong cách riêng bạn</Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="demo@modami.app"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
            secureTextEntry
          />

          {authError && (
            <Text className="text-sm text-red-500 text-center">{authError}</Text>
          )}

          <Button onPress={handleLogin} loading={isLoading} className="mt-2">
            Đăng nhập
          </Button>

          <View className="flex-row items-center gap-3 my-2">
            <View className="flex-1 h-px bg-surface-container" />
            <Text className="text-xs text-secondary">hoặc</Text>
            <View className="flex-1 h-px bg-surface-container" />
          </View>

          <Button variant="secondary" onPress={() => loginWithOAuth('google')} loading={isLoading}>
            Tiếp tục với Google
          </Button>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8 gap-1">
          <Text className="text-sm text-secondary">Chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-sm font-semibold text-primary">Đăng ký</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-center text-secondary/60 mt-6">
          Demo: demo@modami.app / demo1234
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
