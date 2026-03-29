import { useState, useRef } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useCreditStore, useProductStore } from '@/store/app.store';
import { useProduct, useSimilarProducts } from '@/hooks/queries/product.queries';
import { CONDITION_LABEL } from '../constants/product-detail.constants';

export function useProductDetail(productId: string, navigation: any) {
  const [imageIndex, setImageIndex] = useState(0);
  const galleryRef = useRef<ScrollView>(null);

  const balance = useCreditStore((s) => s.balance);
  const deductCredit = useCreditStore((s) => s.deductCredit);
  const isUnlocked = useProductStore((s) => s.isUnlocked);
  const unlockProduct = useProductStore((s) => s.unlockProduct);

  const { data: productData, isLoading: productLoading } = useProduct(productId);
  const { data: similarData, isLoading: similarLoading } = useSimilarProducts(productId);

  const product = productData?.data ?? null;
  const similarProducts = similarData?.data ?? [];
  const isLoading = productLoading;

  const specRows = (() => {
    if (!product) return [];
    const rows: { label: string; value: string }[] = [];
    if (product.referenceCode) rows.push({ label: 'MÃ SẢN PHẨM', value: product.referenceCode });
    rows.push({ label: 'DANH MỤC', value: product.category });
    rows.push({ label: 'TÌNH TRẠNG', value: CONDITION_LABEL[product.condition] ?? product.condition });
    if (product.gender) rows.push({ label: 'GIỚI TÍNH', value: product.gender });
    if (product.brand) rows.push({ label: 'THƯƠNG HIỆU', value: product.brand });
    if (product.season) rows.push({ label: 'GỢI Ý MÙA', value: product.season });
    if (product.size) rows.push({ label: 'KÍCH CỠ', value: product.size });
    if (product.fit) rows.push({ label: 'DÁNG', value: product.fit });
    if (product.material) rows.push({ label: 'CHẤT LIỆU', value: product.material });
    if (product.color) rows.push({ label: 'MÀU SẮC', value: product.color });
    if (product.year != null) rows.push({ label: 'NĂM', value: String(product.year) });
    if (product.origin) rows.push({ label: 'XUẤT XỨ', value: product.origin });
    if (product.dimensions) rows.push({ label: 'SỐ ĐO / KÍCH THƯỚC', value: product.dimensions });
    return rows;
  })();

  const unlocked = product ? (!product.isUnlockRequired || isUnlocked(productId)) : false;

  const handleThumbPress = (index: number, screenWidth: number) => {
    setImageIndex(index);
    galleryRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  const handleUnlock = () => {
    if (!product) return;
    if (balance < product.creditCost) {
      Alert.alert(
        'Không đủ Credits',
        `Bạn cần ${product.creditCost} credits để xem thông tin này. Số dư hiện tại: ${balance} credits.`,
        [
          { text: 'Huỷ', style: 'cancel' },
          { text: 'Nạp thêm', onPress: () => navigation.navigate('Credits') },
        ],
      );
      return;
    }
    Alert.alert(
      'Xác nhận',
      `Dùng ${product.creditCost} credits để xem thông tin liên hệ người bán?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            deductCredit(product.creditCost);
            unlockProduct(productId);
          },
        },
      ],
    );
  };

  return {
    product,
    similarProducts,
    specRows,
    unlocked,
    isLoading,
    imageIndex,
    setImageIndex,
    balance,
    handleUnlock,
    handleThumbPress,
    galleryRef,
  };
}
