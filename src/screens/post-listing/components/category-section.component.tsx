import React from 'react';
import { View, Text } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { CATEGORIES } from '@/constants/app.constants';
import type { PostListingFormValues } from '../hooks/usePostListingScreen';
import { SectionTitle } from './section-title.component';
import { ChipPicker } from './chip-picker.component';

type Props = Readonly<{
  control: Control<PostListingFormValues>;
  errors: FieldErrors<PostListingFormValues>;
}>;

export function CategorySection({ control, errors }: Props) {
  return (
    <View className="px-5 pt-4">
      <SectionTitle>Danh mục *</SectionTitle>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View className="gap-1.5">
            <ChipPicker
              options={CATEGORIES}
              selected={value || null}
              onSelect={onChange}
            />
            {errors.category && (
              <Text className="text-xs text-red-500">{errors.category.message}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
