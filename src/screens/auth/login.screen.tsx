import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XMarkIcon } from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { InputPassword } from '@/components/ui/input-password.component';
import { COLORS } from '@/constants/app.constants';
import { useLoginScreen } from './hooks/useLoginScreen';
import { AuthBrand } from './components/auth-brand.component';
import { AuthDivider } from './components/auth-divider.component';

type Props = RootStackScreenProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
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
      {/* Close button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={{ position: 'absolute', top: insets.top + 12, right: 20, zIndex: 10 }}
      >
        <XMarkIcon size={24} color={COLORS.secondary} />
      </TouchableOpacity>

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
          <InputPassword
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
          />

          {authError && (
            <Text className="text-sm text-red-500 text-center">{authError}</Text>
          )}

          <Button
            onPress={async () => {
              const ok = await handleLogin();
              if (ok) navigation.goBack();
            }}
            loading={isLoading}
            className="mt-2"
          >
            Đăng nhập
          </Button>

          <AuthDivider />

          <Button
            variant="secondary"
            onPress={async () => {
              await handleOAuth('google');
              navigation.goBack();
            }}
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
