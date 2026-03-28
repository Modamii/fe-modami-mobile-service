import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { CATEGORIES, CONDITIONS, COLORS } from '@/constants/app.constants';
import { usePostListingScreen } from './hooks/usePostListingScreen';
import { PhotoGrid } from './components/photo-grid.component';
import { SectionTitle } from './components/section-title.component';
import { ChipPicker } from './components/chip-picker.component';

type Props = MainTabScreenProps<'PostListing'>;

const CONDITION_LABELS: Record<string, string> = {
  new: 'Mới — chưa dùng, còn tag',
  'like-new': 'Như mới — dùng 1-2 lần',
  good: 'Tốt — dùng vài lần, không lỗi',
  fair: 'Khá tốt — có dấu hiệu dùng nhỏ',
};

const CONDITION_NAMES: Record<string, string> = {
  new: 'Mới',
  'like-new': 'Như mới',
  good: 'Tốt',
  fair: 'Khá tốt',
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Khác'];

export function PostListingScreen(_props: Props) {
  const {
    form,
    photos,
    handleAddPhoto,
    handleRemovePhoto,
    handleReorderPhotos,
    onSubmit,
  } = usePostListingScreen();

  const { control, formState: { errors } } = form;
  const scrollRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-5 pt-4 pb-2">
            <Text className="text-2xl font-black text-on-surface tracking-tight">
              Đăng bán
            </Text>
            <Text className="text-sm text-secondary mt-0.5">
              Chia sẻ món đồ của bạn với cộng đồng
            </Text>
          </View>

          {/* Photos */}
          <View className="px-5 pt-4 pb-2">
            <SectionTitle>Ảnh sản phẩm</SectionTitle>
            <PhotoGrid
              photos={photos}
              onAdd={handleAddPhoto}
              onRemove={handleRemovePhoto}
              onReorder={handleReorderPhotos}
              onDragStart={() => setScrollEnabled(false)}
              onDragEnd={() => setScrollEnabled(true)}
            />
          </View>

          {/* Basic info */}
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

            <View className="flex-row gap-3">
              <View className="flex-1">
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
              <View className="flex-1">
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

          {/* Category */}
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

          {/* Condition */}
          <View className="px-5 pt-4">
            <SectionTitle>Tình trạng *</SectionTitle>
            <Controller
              control={control}
              name="condition"
              render={({ field: { onChange, value } }) => (
                <View className="gap-2">
                  {CONDITIONS.map((cond) => {
                    const isSelected = value === cond;
                    return (
                      <TouchableOpacity
                        key={cond}
                        onPress={() => onChange(cond)}
                        className={`flex-row items-center gap-3 rounded-xl px-4 py-3 ${isSelected ? 'bg-primary/10' : 'bg-surface'}`}
                        style={
                          isSelected
                            ? undefined
                            : {
                                shadowColor: COLORS.onSurface,
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.04,
                                shadowRadius: 4,
                                elevation: 1,
                              }
                        }
                      >
                        <CheckCircleIcon
                          size={20}
                          color={isSelected ? COLORS.primary : COLORS.outlineVariant}
                        />
                        <View className="flex-1">
                          <Text
                            className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-on-surface'}`}
                          >
                            {CONDITION_NAMES[cond] ?? cond}
                          </Text>
                          <Text className="text-xs text-secondary mt-0.5">
                            {CONDITION_LABELS[cond]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {errors.condition && (
                    <Text className="text-xs text-red-500">{errors.condition.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Size */}
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

          {/* Description */}
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

          {/* Submit */}
          <View className="px-5 pb-8">
            <Button onPress={onSubmit}>Đăng bán ngay</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
