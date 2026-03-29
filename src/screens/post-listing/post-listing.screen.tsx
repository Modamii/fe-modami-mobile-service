import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BuildingStorefrontIcon } from 'react-native-heroicons/outline';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { COLORS } from '@/constants/app.constants';
import { useAuthStore } from '@/store/app.store';
import { usePostListingScreen } from './hooks/usePostListingScreen';
import { PhotoGrid } from './components/photo-grid.component';
import { SectionTitle } from './components/section-title.component';
import { BasicInfoSection } from './components/basic-info-section.component';
import { CategorySection } from './components/category-section.component';
import { ConditionSection } from './components/condition-section.component';
import { SizeSection } from './components/size-section.component';
import { DescriptionSection } from './components/description-section.component';

type Props = MainTabScreenProps<'PostListing'>;

export function PostListingScreen({ navigation }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { form, photos, submitting, handleAddPhoto, handleRemovePhoto, handleReorderPhotos, onSubmit } = usePostListingScreen(
    () => navigation.navigate('MyListings'),
  );
  const { control, formState: { errors } } = form;
  const scrollRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-black text-on-surface tracking-tight">Đăng bán</Text>
        </View>
        <View className="flex-1 items-center justify-center px-8 gap-5">
          <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center">
            <BuildingStorefrontIcon size={40} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <View className="items-center gap-2">
            <Text className="text-lg font-bold text-on-surface text-center">Cần đăng nhập</Text>
            <Text className="text-sm text-secondary text-center leading-5">
              Đăng nhập để đăng bán sản phẩm và quản lý tin đăng của bạn.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="bg-primary rounded-2xl px-8 py-4 w-full items-center"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <View className="px-5 pt-4 pb-2">
            <Text className="text-2xl font-black text-on-surface tracking-tight">
              Đăng bán
            </Text>
            <Text className="text-sm text-secondary mt-0.5">
              Chia sẻ món đồ của bạn với cộng đồng
            </Text>
          </View>

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

          <BasicInfoSection control={control} errors={errors} />
          <CategorySection control={control} errors={errors} />
          <ConditionSection control={control} errors={errors} />
          <SizeSection control={control} />
          <DescriptionSection control={control} />

          <View className="px-5 pb-8">
            <Button onPress={onSubmit} loading={submitting}>Đăng bán ngay</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
