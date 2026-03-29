import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAuthStore } from '@/store/app.store';
import { authService } from '@/services/auth.service';

export const editProfileSchema = z.object({
  full_name: z.string().min(1, 'Vui lòng nhập tên hiển thị'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Tối đa 500 ký tự').optional(),
  gender: z.enum(['male', 'female', 'other', 'undisclosed']).optional(),
  date_of_birth: z.string().optional(),
  email: z.string().email('Email không hợp lệ').min(1),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export function useEditProfileScreen(onSaved: () => void) {
  const user = useAuthStore(s => s.user);
  const updateProfileApi = useAuthStore(s => s.updateProfileApi);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      bio: '',
      gender: undefined,
      date_of_birth: '',
      email: '',
    },
  });

  const [originalEmail, setOriginalEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const currentEmail = form.watch('email');
  const emailChanged = currentEmail?.trim() !== originalEmail;

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      form.reset({
        full_name: user.name,
        phone: user.phone ?? '',
        bio: user.bio ?? '',
        gender: user.gender,
        date_of_birth: user.date_of_birth ?? '',
        email: user.email,
      });
      setOriginalEmail(user.email);
      setEmailVerified(user.email_verified ?? false);
    }, [user, form]),
  );

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => setKeyboardHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0),
    );
    return () => { show.remove(); hide.remove(); };
  }, []);

  async function handleSendOtp() {
    const email = form.getValues('email').trim();
    setSendingOtp(true);
    try {
      await authService.sendOtp(email, 'register');
      setOtp('');
      setOtpError(false);
      bottomSheetRef.current?.expand();
    } catch (err: any) {
      form.setError('email', { message: err?.message ?? 'Không thể gửi mã xác nhận.' });
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length < 6) { setOtpError(true); return; }
    setVerifying(true);
    setOtpError(false);
    try {
      // TODO: backend cần endpoint verify OTP cho đổi email
      await authService.verifyOtp(form.getValues('email').trim(), otp, 'forgot-password');
      setEmailVerified(true);
      bottomSheetRef.current?.close();
    } catch {
      setOtpError(true);
    } finally {
      setVerifying(false);
    }
  }

  function handleCloseSheet() {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  }

  const handleSave = form.handleSubmit(async values => {
    if (emailChanged && !emailVerified) {
      form.setError('email', { message: 'Vui lòng xác minh email mới trước khi lưu' });
      return;
    }
    setSaving(true);
    try {
      await updateProfileApi({
        full_name: values.full_name.trim(),
        phone: values.phone?.trim() || undefined,
        bio: values.bio?.trim() || undefined,
        gender: values.gender,
        date_of_birth: values.date_of_birth || undefined,
      });
      Alert.alert('Đã lưu', 'Hồ sơ của bạn đã được cập nhật.', [
        { text: 'OK', onPress: onSaved },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message ?? 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  });

  return {
    form,
    user,
    emailChanged,
    emailVerified,
    setEmailVerified,
    sendingOtp,
    otp,
    setOtp,
    otpError,
    setOtpError,
    verifying,
    saving,
    keyboardHeight,
    bottomSheetRef,
    handleSendOtp,
    handleVerifyOtp,
    handleCloseSheet,
    handleSave,
  };
}
