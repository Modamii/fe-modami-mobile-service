import { useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import { listingService } from '@/services/listing.service';
import { listingKeys } from '@/hooks/queries/listing.queries';
import type { ProductCondition } from '@/types/app.type';

export type PhotoItem = {
  id: string;
  uri: string;
};

const MAX_PHOTOS = 6;

export const postListingSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  price: z
    .string()
    .min(1, 'Vui lòng nhập giá bán')
    .regex(/^\d[\d.,]*$/, 'Giá không hợp lệ'),
  brand: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  size: z.string().optional(),
  condition: z.string().min(1, 'Vui lòng chọn tình trạng'),
});

export type PostListingFormValues = z.infer<typeof postListingSchema>;

export function usePostListingScreen(onSuccess?: () => void) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<PostListingFormValues>({
    resolver: zodResolver(postListingSchema),
    defaultValues: {
      title: '',
      price: '',
      brand: '',
      description: '',
      category: '',
      size: '',
      condition: '',
    },
  });

  function handleAddPhoto() {
    if (photos.length >= MAX_PHOTOS) return;

    Alert.alert('Thêm ảnh', undefined, [
      { text: 'Chụp ảnh', onPress: openCamera },
      { text: 'Chọn từ thư viện', onPress: openLibrary },
      { text: 'Hủy', style: 'cancel' },
    ]);
  }

  async function openCamera() {
    const remaining = MAX_PHOTOS - photos.length;
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1080,
      maxHeight: 1080,
    });
    if (result.assets) appendAssets(result.assets.slice(0, remaining));
  }

  async function openLibrary() {
    const remaining = MAX_PHOTOS - photos.length;
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1080,
      maxHeight: 1080,
      selectionLimit: remaining,
    });
    if (result.assets) appendAssets(result.assets.slice(0, remaining));
  }

  function appendAssets(assets: Asset[]) {
    const newPhotos: PhotoItem[] = assets
      .filter((a): a is Asset & { uri: string } => !!a.uri)
      .map((a) => ({ id: `photo-${Date.now()}-${Math.random()}`, uri: a.uri }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
  }

  function handleRemovePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function handleReorderPhotos(reordered: PhotoItem[]) {
    setPhotos(reordered);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await listingService.submitListing({
        title: values.title,
        price: Number(values.price.replace(/[.,]/g, '')),
        images: photos.map((p) => p.uri),
        category: values.category,
        condition: values.condition as ProductCondition,
        brand: values.brand || undefined,
        description: values.description || undefined,
        size: values.size || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
      form.reset();
      setPhotos([]);
      Alert.alert(
        'Đã gửi bài đăng!',
        'Sản phẩm của bạn đang chờ kiểm duyệt bởi đội ngũ ModaMi. Chúng tôi sẽ thông báo kết quả trong 24 giờ.',
        [{ text: 'Xem bài đăng', onPress: onSuccess }, { text: 'Đóng' }],
      );
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message ?? 'Không thể gửi bài đăng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  });

  return {
    form,
    photos,
    submitting,
    handleAddPhoto,
    handleRemovePhoto,
    handleReorderPhotos,
    onSubmit,
  };
}
