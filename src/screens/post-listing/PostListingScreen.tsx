import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { MainTabScreenProps } from '@/navigation/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Props = MainTabScreenProps<'PostListing'>;

export function PostListingScreen(_props: Props) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 py-4 gap-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold text-on-surface tracking-tight">Đăng bán</Text>

          {/* Photo upload placeholder */}
          <View className="w-full aspect-square bg-surface-container rounded-2xl items-center justify-center">
            <Text className="text-4xl mb-2">📷</Text>
            <Text className="text-secondary text-sm font-medium">Thêm ảnh sản phẩm</Text>
            <Text className="text-secondary/60 text-xs mt-1">Tối đa 6 ảnh</Text>
          </View>

          <View className="gap-4">
            <Input
              label="Tên sản phẩm"
              value={title}
              onChangeText={setTitle}
              placeholder="VD: Áo blazer vintage xanh navy"
            />
            <Input
              label="Giá bán (VND)"
              value={price}
              onChangeText={setPrice}
              placeholder="VD: 350000"
              keyboardType="numeric"
            />
            <Input
              label="Mô tả"
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả chi tiết về sản phẩm..."
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />
          </View>

          <Button
            disabled={!title || !price}
            onPress={() => {
              /* TODO: submit listing */
            }}
          >
            Đăng bán ngay
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
