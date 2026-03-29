import React, { forwardRef } from 'react';
import { OtpInput, type OtpInputProps, type OtpInputRef } from 'react-native-otp-entry';
import { COLORS } from '@/constants/app.constants';

interface OtpInputComponentProps extends Omit<OtpInputProps, 'numberOfDigits'> {
  numberOfDigits?: number;
  error?: boolean;
}

export const OtpInputComponent = forwardRef<OtpInputRef, OtpInputComponentProps>(
  (
    {
      numberOfDigits = 6,
      onTextChange,
      error,
      secureTextEntry = false,
      ...rest
    },
    ref,
  ) => {
    return (
      <OtpInput
        ref={ref}
        numberOfDigits={numberOfDigits}
        onTextChange={onTextChange}
        secureTextEntry={secureTextEntry}
        focusColor={error ? '#ef4444' : COLORS.primary}
        hideStick
        focusStickBlinkingDuration={500}
        theme={{
          containerStyle: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          },
          pinCodeContainerStyle: {
            flex: 1,
            height: 52,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: error ? '#ef4444' : '#e0e0de',
            backgroundColor: '#f5f5f4',
          },
          pinCodeTextStyle: {
            fontSize: 22,
            fontWeight: '700',
            color: COLORS.onSurface,
          },
          focusStickStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
        {...rest}
      />
    );
  },
);

OtpInputComponent.displayName = 'OtpInputComponent';
