import React from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input.component';
import type { PostListingFormValues } from '../hooks/usePostListingScreen';
import { SectionTitle } from './section-title.component';

type Props = Readonly<{
  control: Control<PostListingFormValues>;
  errors: FieldErrors<PostListingFormValues>;
}>;

export function BasicInfoSection({ control, errors }: Props) {
  return (
    <View className="px-5 pt-4 gap-3">
      <SectionTitle>Thông tin cơ bản</SectionTitle>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Tên sản phẩm *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="VD: Áo blazer vintage xanh navy"
            error={errors.title?.message}
          />
        )}
      />

      <View className="flex-row">
        <View className="mr-3 min-w-0 flex-1">
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Giá bán (₫) *"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="350.000"
                keyboardType="numeric"
                error={errors.price?.message}
              />
            )}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Controller
            control={control}
            name="brand"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Thương hiệu"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Zara, H&M..."
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
