import React from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input.component';
import type { PostListingFormValues } from '../hooks/usePostListingScreen';
import { SectionTitle } from './section-title.component';

type Props = Readonly<{
  control: Control<PostListingFormValues>;
}>;

export function DescriptionSection({ control }: Props) {
  return (
    <View className="px-5 pt-4 pb-4">
      <SectionTitle>Mô tả thêm</SectionTitle>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label=""
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Mô tả chi tiết: xuất xứ, lý do bán, ghi chú kích thước thực tế..."
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        )}
      />
    </View>
  );
}
