import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { OtpInputRef } from 'react-native-otp-entry';
import { useAuthStore } from '@/store/app.store';
import { authService } from '@/services/auth.service';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
    .max(30, 'Tên đăng nhập tối đa 30 ký tự')
    .regex(/^[a-z0-9_]+$/, 'Chỉ dùng chữ thường, số và dấu gạch dưới'),
  name: z.string().min(1, 'Vui lòng nhập tên hiển thị'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  consent: z
    .boolean()
    .refine(value => value, 'Bạn cần đồng ý Điều khoản và Chính sách bảo mật.'),
});

export type RegisterFormValues = z.infer<typeof schema>;

export function useRegisterScreen() {
  const loginWithTokens = useAuthStore(s => s.loginWithTokens);

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [pendingValues, setPendingValues] = useState<RegisterFormValues | null>(
    null,
  );
  const otpRef = useRef<OtpInputRef>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: '',
      consent: false,
    },
  });

  // Bước 1: gửi OTP
  async function handleSendOtp(values: RegisterFormValues): Promise<void> {
    setApiError('');
    setIsLoading(true);
    try {
      await authService.sendOtp(values.email, 'register');
      setPendingValues(values);
      setStep(2);
    } catch (err: any) {
      setApiError(err.message ?? 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }

  // Bước 2: xác minh OTP → đăng ký + đăng nhập luôn
  async function handleVerifyOtp(): Promise<boolean> {
    if (!pendingValues || otp.length < 6) {
      setOtpError(true);
      return false;
    }
    setApiError('');
    setOtpError(false);
    setIsLoading(true);
    try {
      const tokens = await authService.verifyOtpRegister(
        pendingValues.email,
        otp,
        pendingValues.username,
        pendingValues.password,
        pendingValues.name.split(' ')[0] ?? '',
        pendingValues.name.split(' ')[1] ?? '',
      );
      return await loginWithTokens(tokens);
    } catch (err: any) {
      setOtpError(true);
      otpRef.current?.clear();
      setOtp('');
      setApiError(err.message ?? 'Mã OTP không hợp lệ hoặc đã hết hạn.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp(): Promise<void> {
    if (!pendingValues) return;
    setIsLoading(true);
    try {
      await authService.sendOtp(pendingValues.email, 'register');
      otpRef.current?.clear();
      setOtp('');
      setOtpError(false);
      setApiError('');
    } catch (err: any) {
      setApiError(err.message ?? 'Không thể gửi lại OTP.');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    form,
    step,
    setStep,
    isLoading,
    apiError,
    otp,
    setOtp,
    otpError,
    otpRef,
    pendingEmail: pendingValues?.email ?? '',
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
  };
}
