import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import type { OtpInputRef } from 'react-native-otp-entry';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { OtpInputComponent } from '@/components/ui/otp-input.component';
import { COLORS } from '@/constants/app.constants';
import { authService } from '@/services/auth.service';

type Props = RootStackScreenProps<'ForgotPassword'>;

// ─── Step 1: Email ────────────────────────────────────────────────────────────
const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});
type EmailFormValues = z.infer<typeof emailSchema>;

// ─── Step 3: New password ─────────────────────────────────────────────────────
const passwordSchema = z
  .object({
    password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const otpRef = useRef<OtpInputRef>(null);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  // ─── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = emailForm.handleSubmit(async (values) => {
    setError('');
    setIsLoading(true);
    try {
      await authService.sendOtp(values.email, 'forgot-password');
      setEmail(values.email);
      setStep(2);
    } catch {
      setError('Không thể gửi mã OTP. Vui lòng kiểm tra lại email.');
    } finally {
      setIsLoading(false);
    }
  });

  // ─── Step 2: Verify OTP ────────────────────────────────────────────────────
  async function handleVerifyOtp() {
    if (otp.length < 6) {
      setOtpError(true);
      return;
    }
    setError('');
    setOtpError(false);
    setIsLoading(true);
    try {
      const token = await authService.verifyOtp(email, otp, 'forgot-password');
      setResetToken(token);
      setStep(3);
    } catch {
      setOtpError(true);
      setError('Mã OTP không chính xác hoặc đã hết hạn.');
      otpRef.current?.clear();
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    setError('');
    setIsLoading(true);
    try {
      await authService.sendOtp(email, 'forgot-password');
      otpRef.current?.clear();
      setOtp('');
      setOtpError(false);
    } catch {
      setError('Không thể gửi lại mã OTP.');
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Step 3: Reset password ────────────────────────────────────────────────
  const handleResetPassword = passwordForm.handleSubmit(async (values) => {
    setError('');
    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, values.password);
      navigation.goBack();
    } catch {
      setError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  });

  const stepTitles = {
    1: { title: 'Quên mật khẩu', subtitle: 'Nhập email để nhận mã xác nhận' },
    2: { title: 'Nhập mã OTP', subtitle: `Mã đã được gửi đến ${email}` },
    3: { title: 'Mật khẩu mới', subtitle: 'Tạo mật khẩu mới cho tài khoản của bạn' },
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
        {/* Header */}
        <View className="mb-10">
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : setStep((s) => (s - 1) as 1 | 2 | 3))}
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
            {([1, 2, 3] as const).map((s) => (
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

          <Text className="text-3xl font-bold text-on-surface tracking-tight">
            {stepTitles[step].title}
          </Text>
          <Text className="text-base text-secondary mt-1">{stepTitles[step].subtitle}</Text>
        </View>

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <View className="gap-4">
            <Controller
              control={emailForm.control}
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
                  autoComplete="email"
                  error={emailForm.formState.errors.email?.message}
                  returnKeyType="done"
                  onSubmitEditing={handleSendOtp}
                />
              )}
            />
            {error ? <Text className="text-sm text-red-500 text-center">{error}</Text> : null}
            <Button onPress={handleSendOtp} loading={isLoading} className="mt-2">
              Gửi mã xác nhận
            </Button>
          </View>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <View className="gap-6">
            <OtpInputComponent
              ref={otpRef}
              error={otpError}
              onTextChange={(text) => {
                setOtp(text);
                if (otpError && text.length > 0) setOtpError(false);
              }}
            />
            {error ? <Text className="text-sm text-red-500 text-center">{error}</Text> : null}
            <Button onPress={handleVerifyOtp} loading={isLoading}>
              Xác nhận mã OTP
            </Button>
            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-secondary">Chưa nhận được mã?</Text>
              <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
                <Text className="text-sm font-semibold text-primary">Gửi lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Step 3: New password ── */}
        {step === 3 && (
          <View className="gap-4">
            <Controller
              control={passwordForm.control}
              name="password"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  ref={ref}
                  label="Mật khẩu mới"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Tối thiểu 8 ký tự"
                  secureTextEntry
                  error={passwordForm.formState.errors.password?.message}
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  ref={ref}
                  label="Xác nhận mật khẩu"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  returnKeyType="done"
                  onSubmitEditing={handleResetPassword}
                />
              )}
            />
            {error ? <Text className="text-sm text-red-500 text-center">{error}</Text> : null}
            <Button onPress={handleResetPassword} loading={isLoading} className="mt-2">
              Đặt lại mật khẩu
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
