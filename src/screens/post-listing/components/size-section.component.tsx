import React from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { PostListingFormValues } from '../hooks/usePostListingScreen';
import { SIZES } from '../post-listing.constants';
import { SectionTitle } from './section-title.component';
import { ChipPicker } from './chip-picker.component';

type Props = Readonly<{
  control: Control<PostListingFormValues>;
}>;

export function SizeSection({ control }: Props) {
  return (
    <View className="px-5 pt-4">
      <SectionTitle>Kích cỡ</SectionTitle>
      <Controller
        control={control}
        name="size"
        render={({ field: { onChange, value } }) => (
          <ChipPicker
            options={SIZES}
            selected={value || null}
            onSelect={onChange}
          />
        )}
      />
    </View>
  );
}
