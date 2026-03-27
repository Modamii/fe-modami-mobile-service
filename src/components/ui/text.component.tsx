import React from 'react';
import { Text as RNText, type TextProps } from 'react-native';

type Variant = 'display' | 'headline' | 'body' | 'label' | 'caption';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

interface AppTextProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  muted?: boolean;
}

const variantClass: Record<Variant, string> = {
  display: 'text-3xl tracking-tight',
  headline: 'text-xl tracking-tight',
  body: 'text-base leading-relaxed',
  label: 'text-sm uppercase tracking-widest',
  caption: 'text-xs',
};

const weightClass: Record<Weight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function AppText({
  variant = 'body',
  weight = 'regular',
  muted = false,
  className,
  ...props
}: AppTextProps) {
  return (
    <RNText
      className={`${variantClass[variant]} ${weightClass[weight]} ${muted ? 'text-on-surface/50' : 'text-on-surface'} ${className ?? ''}`}
      {...props}
    />
  );
}
