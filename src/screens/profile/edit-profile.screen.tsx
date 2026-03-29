import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { ShieldExclamationIcon, CheckCircleIcon } from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { Input } from '@/components/ui/input.component';
import { Button } from '@/components/ui/button.component';
import { DatePickerInput } from '@/components/ui/date-picker-input.component';
import { COLORS } from '@/constants/app.constants';
import { useEditProfileScreen } from './hooks/useEditProfileScreen';
import { GenderPicker } from './components/gender-picker.component';
import { OtpVerifySheet } from './components/otp-verify-sheet.component';

type Props = RootStackScreenProps<'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const {
    form,
    user,
    emailChanged,
    emailVerified,
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
  } = useEditProfileScreen(() => navigation.goBack());

  const { control, formState: { errors }, watch } = form;
  const currentEmail = watch('email');

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, paddingTop: 8 }}
      >
        <Text className="text-sm text-secondary mb-4 leading-5">
          Thông tin hiển thị trên cửa hàng và khi bạn mua bán với cộng đồng ModaMi.
        </Text>

        <View className="gap-4">
          {/* Full name */}
          <Controller
            control={control}
            name="full_name"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Tên hiển thị *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="VD: Minh Curator"
                error={errors.full_name?.message}
                autoCapitalize="words"
              />
            )}
          />

          {/* Username — read-only */}
          {user.username && (
            <View className="gap-1">
              <Text className="text-sm font-medium text-on-surface/70">Tên đăng nhập</Text>
              <View className="h-[50px] bg-surface-container/60 rounded-xl px-4 justify-center border border-transparent">
                <Text className="text-base text-secondary">@{user.username}</Text>
              </View>
              <Text className="text-xs text-secondary">Tên đăng nhập không thể thay đổi.</Text>
            </View>
          )}

          {/* Phone */}
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Số điện thoại"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="VD: 0901234567"
                keyboardType="phone-pad"
                error={errors.phone?.message}
              />
            )}
          />

          {/* Email with verify */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Email"
                value={value}
                onChangeText={t => {
                  onChange(t);
                  // reset verified when email changes
                }}
                onBlur={onBlur}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email?.message}
                rightElement={
                  emailVerified && !emailChanged ? (
                    <CheckCircleIcon size={20} color="#22c55e" />
                  ) : emailChanged ? (
                    <TouchableOpacity
                      onPress={handleSendOtp}
                      disabled={sendingOtp}
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    >
                      {sendingOtp ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                      ) : (
                        <ShieldExclamationIcon size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ) : null
                }
              />
            )}
          />

          {/* Gender */}
          <Controller
            control={control}
            name="gender"
            render={({ field: { value, onChange } }) => (
              <GenderPicker value={value} onChange={onChange} />
            )}
          />

          {/* Date of birth */}
          <Controller
            control={control}
            name="date_of_birth"
            render={({ field: { value, onChange } }) => (
              <DatePickerInput
                label="Ngày sinh"
                value={value}
                onChange={onChange}
                error={errors.date_of_birth?.message}
              />
            )}
          />

          {/* Bio */}
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                ref={ref}
                label="Giới thiệu ngắn"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Chia sẻ phong cách, niche bạn tuyển chọn đồ…"
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: 'top', paddingTop: 10 }}
                error={errors.bio?.message}
              />
            )}
          />
        </View>

        <View className="mt-8 gap-3">
          <Button onPress={handleSave} loading={saving}>
            Lưu thay đổi
          </Button>
          <Button variant="secondary" onPress={() => navigation.goBack()}>
            Huỷ
          </Button>
        </View>
      </ScrollView>

      <OtpVerifySheet
        sheetRef={bottomSheetRef}
        email={currentEmail}
        otp={otp}
        onOtpChange={text => {
          setOtp(text);
          if (otpError) setOtpError(false);
        }}
        otpError={otpError}
        verifying={verifying}
        sendingOtp={sendingOtp}
        keyboardHeight={keyboardHeight}
        onVerify={handleVerifyOtp}
        onResend={handleSendOtp}
        onClose={handleCloseSheet}
      />
    </KeyboardAvoidingView>
  );
}
