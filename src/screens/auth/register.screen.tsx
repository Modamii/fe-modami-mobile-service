import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Checkbox } from '@/components/ui/checkbox.component';
import { Input } from '@/components/ui/input.component';
import { OtpInputComponent } from '@/components/ui/otp-input.component';
import {
  COLORS,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
} from '@/constants/app.constants';
import { useRegisterScreen } from './hooks/useRegisterScreen';
import { AuthBrand } from './components/auth-brand.component';

type Props = RootStackScreenProps<'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const {
    form,
    step,
    setStep,
    isLoading,
    apiError,
    setOtp,
    otpError,
    otpRef,
    pendingEmail,
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
  } = useRegisterScreen();

  const { control, handleSubmit, formState: { errors } } = form;

  const onSubmitStep1 = handleSubmit(handleSendOtp);

  async function onSubmitStep2() {
    const ok = await handleVerifyOtp();
    if (ok) navigation.goBack();
  }

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
        {/* Header */}
        <View className="mb-10">
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}
            className="flex-row items-center gap-1 mb-5"
            hitSlop={8}
          >
            <ChevronLeftIcon size={18} color={COLORS.primary} />
            <Text className="text-primary font-medium">
              {step === 1 ? 'Quay lại' : 'Bước trước'}
            </Text>
          </TouchableOpacity>

          {/* Step indicator */}
          <View className="flex-row gap-2 mb-6">
            {([1, 2] as const).map((s) => (
              <View
                key={s}
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 2,
                  backgroundColor: s <= step ? COLORS.primary : '#e0e0de',
                }}
              />
            ))}
          </View>

          <AuthBrand compact />
          <Text className="text-3xl font-bold text-on-surface tracking-tight mt-3">
            {step === 1 ? 'Tạo tài khoản' : 'Xác minh email'}
          </Text>
          <Text className="text-base text-secondary mt-1">
            {step === 1
              ? 'Bắt đầu hành trình thời trang của bạn'
              : `Mã OTP đã gửi đến ${pendingEmail}`}
          </Text>
        </View>

        {/* ── Bước 1: Form đăng ký ── */}
        {step === 1 && (
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
                  error={errors.username?.message}
                  returnKeyType="next"
                />
              )}
            />

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  ref={ref}
                  label="Tên hiển thị"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Tên của bạn"
                  autoCapitalize="words"
                  error={errors.name?.message}
                  returnKeyType="next"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  ref={ref}
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
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
                  placeholder="Tối thiểu 8 ký tự"
                  secureTextEntry
                  error={errors.password?.message}
                  returnKeyType="done"
                  onSubmitEditing={onSubmitStep1}
                />
              )}
            />

            {/* Consent Checkbox */}
            <Controller
              control={control}
              name="consent"
              render={({ field: { onChange, value } }) => (
                <View className="gap-2">
                  <Checkbox
                    checked={Boolean(value)}
                    onToggle={onChange}
                    error={errors.consent?.message}
                    label="Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật"
                  />
                  <View className="flex-row gap-4 ml-8">
                    <TouchableOpacity onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)}>
                      <Text className="text-xs text-primary font-semibold">Điều khoản</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
                      <Text className="text-xs text-primary font-semibold">Chính sách bảo mật</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            {apiError ? (
              <Text className="text-sm text-red-500 text-center">{apiError}</Text>
            ) : null}

            <Button onPress={onSubmitStep1} loading={isLoading} className="mt-2">
              Tiếp tục
            </Button>
          </View>
        )}

        {/* ── Bước 2: Nhập OTP ── */}
        {step === 2 && (
          <View className="gap-6">
            <OtpInputComponent
              ref={otpRef}
              error={otpError}
              onTextChange={(text) => {
                setOtp(text);
              }}
            />

            {apiError ? (
              <Text className="text-sm text-red-500 text-center">{apiError}</Text>
            ) : null}

            <Button onPress={onSubmitStep2} loading={isLoading}>
              Xác nhận & Đăng ký
            </Button>

            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-secondary">Chưa nhận được mã?</Text>
              <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
                <Text className="text-sm font-semibold text-primary">Gửi lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
