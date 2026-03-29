import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XMarkIcon } from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { COLORS } from '@/constants/app.constants';
import { useLoginScreen } from './hooks/useLoginScreen';
import { AuthBrand } from './components/auth-brand.component';
import { AuthDivider } from './components/auth-divider.component';
import { GoogleIcon, AppleIcon } from '@/components/ui/social-icons.component';

type Props = RootStackScreenProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { form, isLoginLoading, isOAuthLoading, authError, handleLogin } = useLoginScreen();
  const isAnyLoading = isLoginLoading || isOAuthLoading;
  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmit = handleSubmit(async (values) => {
    const ok = await handleLogin(values);
    if (ok) navigation.goBack();
  });

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Tên đăng nhập"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Nhập tên đăng nhập"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                error={errors.username?.message}
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Mật khẩu"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Nhập mật khẩu"
                secureTextEntry
                error={errors.password?.message}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
            )}
          />

          {authError && (
            <Text className="text-sm text-red-500 text-center">{authError}</Text>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            className="self-end"
            hitSlop={8}
          >
            <Text className="text-sm text-primary font-medium">Quên mật khẩu?</Text>
          </TouchableOpacity>

          <Button onPress={onSubmit} loading={isLoginLoading} disabled={isAnyLoading} className="mt-2">
            Đăng nhập
          </Button>

          <AuthDivider />

          <Button
            variant="secondary"
            leftIcon={<GoogleIcon size={18} />}
            onPress={async () => {
              const ok = await handleLogin({ username: 'modami', password: 'Holic@123' });
              if (ok) navigation.goBack();
            }}
            loading={isOAuthLoading}
            disabled={isAnyLoading}
          >
            Tiếp tục với Google
          </Button>

          {Platform.OS === 'ios' && (
            <Button
              variant="secondary"
              leftIcon={<AppleIcon size={24} />}
              onPress={async () => {
                const ok = await handleLogin({ username: 'modami', password: 'Holic@123' });
                if (ok) navigation.goBack();
              }}
              loading={isOAuthLoading}
              disabled={isAnyLoading}
            >
              Tiếp tục với Apple
            </Button>
          )}
        </View>

        <View className="flex-row justify-center mt-8 gap-1">
          <Text className="text-sm text-secondary">Chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-sm font-semibold text-primary">Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
