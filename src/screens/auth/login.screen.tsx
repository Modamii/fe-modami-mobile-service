import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import type { AuthStackScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { useLoginScreen } from './hooks/useLoginScreen';
import { AuthBrand } from './components/auth-brand.component';
import { AuthDivider } from './components/auth-divider.component';

type Props = AuthStackScreenProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    authError,
    handleLogin,
    handleOAuth,
  } = useLoginScreen();

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
          <AuthBrand tagline="Thời trang bền vững, phong cách riêng bạn" />
        </View>

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

          <AuthDivider />

          <Button
            variant="secondary"
            onPress={() => handleOAuth('google')}
            loading={isLoading}
          >
            Tiếp tục với Google
          </Button>
        </View>

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
