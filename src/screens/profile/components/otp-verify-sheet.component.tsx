import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { ShieldCheckIcon } from 'react-native-heroicons/solid';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { OtpInputComponent } from '@/components/ui/otp-input.component';
import { Button } from '@/components/ui/button.component';
import { COLORS } from '@/constants/app.constants';

interface OtpVerifySheetProps {
  sheetRef: React.RefObject<React.ElementRef<typeof BottomSheet> | null>;
  email: string;
  otp: string;
  onOtpChange: (text: string) => void;
  otpError: boolean;
  verifying: boolean;
  sendingOtp: boolean;
  keyboardHeight: number;
  onVerify: () => void;
  onResend: () => void;
  onClose: () => void;
}

export function OtpVerifySheet({
  sheetRef,
  email,
  otp,
  onOtpChange,
  otpError,
  verifying,
  sendingOtp,
  keyboardHeight,
  onVerify,
  onResend,
  onClose,
}: OtpVerifySheetProps) {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
        pressBehavior="none"
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: COLORS.secondary, width: 36, opacity: 0.4 }}
      backgroundStyle={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
          },
          android: { elevation: 8 },
        }),
      }}
    >
      <BottomSheetView
        style={{
          paddingHorizontal: 20,
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 36,
        }}
      >
        {/* Close */}
        <View className="items-end pt-2">
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <XMarkIcon size={22} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View className="items-center pt-1 pb-5">
          <View className="w-13 h-13 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: '#f0fdf4', width: 52, height: 52, borderRadius: 26 }}>
            <ShieldCheckIcon size={26} color={COLORS.primary} />
          </View>
          <Text className="text-[17px] font-bold text-on-surface mb-1">
            Xác minh email
          </Text>
          <Text className="text-sm text-secondary text-center leading-5">
            {'Mã xác nhận đã được gửi đến\n'}
            <Text className="font-semibold text-on-surface">{email}</Text>
          </Text>
        </View>

        {/* OTP */}
        <OtpInputComponent
          onTextChange={text => onOtpChange(text)}
          error={otpError}
        />

        {otpError && (
          <Text className="text-xs text-red-500 text-center mt-2">
            Mã không đúng. Vui lòng kiểm tra lại.
          </Text>
        )}

        {/* Resend */}
        <View className="items-center mt-4">
          <TouchableOpacity onPress={onResend} disabled={sendingOtp} hitSlop={8}>
            <Text
              className="text-sm font-medium text-primary"
              style={{ opacity: sendingOtp ? 0.5 : 1 }}
            >
              {sendingOtp ? 'Đang gửi lại…' : 'Gửi lại mã'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Confirm */}
        <View className="mt-6">
          <Button onPress={onVerify} loading={verifying} disabled={otp.length < 6}>
            Xác nhận
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
