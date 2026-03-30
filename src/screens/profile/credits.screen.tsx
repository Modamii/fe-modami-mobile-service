import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraRoll, iosRequestAddOnlyGalleryPermission } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BoltIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { CreditsSkeleton } from './credits-skeleton.component';
import { useCreditStore } from '@/store/app.store';
import { formatCredits } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';
import { useCreditPackages, useCreditHistory, usePurchaseCredits } from '@/hooks/queries/credit.queries';

type Props = RootStackScreenProps<'Credits'>;

// ─── Constants ─────────────────────────────────────────────────────────────

const cardShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  android: { elevation: 2 },
});

const HOW_IT_WORKS = [
  { icon: '🔓', text: 'Xem thông tin liên hệ người bán' },
  { icon: '💚', text: 'Nhận credits khi bán hàng thành công' },
  { icon: '👑', text: 'Style & Elite nhận bonus credits hàng tháng' },
];

// Dùng VietQR Universal Links thay custom schemes:
// - openURL với https:// không cần LSApplicationQueriesSchemes
// - iOS tự mở app nếu cài, fallback Safari nếu chưa

type VietnamBank = {
  id: string;
  name: string;
  shortName: string;
  scheme: string;
  color: string;
  logo?: ReturnType<typeof require>;
};

const VIETNAM_BANKS: VietnamBank[] = [
  { id: 'vcb', name: 'Vietcombank', shortName: 'VCB', scheme: 'https://dl.vietqr.io/pay?app=vcb', color: '#007b5e', logo: require('@/assets/banks/vietcombank.png') },
  { id: 'vtb', name: 'Vietinbank', shortName: 'VTB', scheme: 'https://dl.vietqr.io/pay?app=icb', color: '#005baa', logo: require('@/assets/banks/vietinbank.png') },
  { id: 'tcb', name: 'Techcombank', shortName: 'TCB', scheme: 'https://dl.vietqr.io/pay?app=tcb', color: '#e31837', logo: require('@/assets/banks/techcombank.png') },
  { id: 'mb', name: 'MB Bank', shortName: 'MB', scheme: 'https://dl.vietqr.io/pay?app=mb', color: '#0066cc', logo: require('@/assets/banks/mb.png') },
  { id: 'acb', name: 'ACB', shortName: 'ACB', scheme: 'https://dl.vietqr.io/pay?app=acb', color: '#0066b3', logo: require('@/assets/banks/acb.png') },
  { id: 'bidv', name: 'BIDV', shortName: 'BIDV', scheme: 'https://dl.vietqr.io/pay?app=bidv', color: '#1a3c6e', logo: require('@/assets/banks/bidv.png') },
  { id: 'agr', name: 'Agribank', shortName: 'AGR', scheme: 'https://dl.vietqr.io/pay?app=vba', color: '#009944', logo: require('@/assets/banks/agribank.png') },
  { id: 'vpb', name: 'VPBank', shortName: 'VPB', scheme: 'https://dl.vietqr.io/pay?app=vpb', color: '#f06400', logo: require('@/assets/banks/vpbank.png') },
  { id: 'tpb', name: 'TPBank', shortName: 'TPB', scheme: 'https://dl.vietqr.io/pay?app=tpb', color: '#6a0dad', logo: require('@/assets/banks/tpbank.png') },
  { id: 'stb', name: 'Sacombank', shortName: 'STB', scheme: 'https://dl.vietqr.io/pay?app=stb', color: '#0066cc', logo: require('@/assets/banks/sacombank.png') },
  { id: 'hdb', name: 'HDBank', shortName: 'HDB', scheme: 'https://dl.vietqr.io/pay?app=hdb', color: '#003087', logo: require('@/assets/banks/hdbank.png') },
  { id: 'ocb', name: 'OCB', shortName: 'OCB', scheme: 'https://dl.vietqr.io/pay?app=ocb', color: '#f26522', logo: require('@/assets/banks/ocb.webp') },
  { id: 'msb', name: 'MSB', shortName: 'MSB', scheme: 'https://dl.vietqr.io/pay?app=msb', color: '#e4002b', logo: require('@/assets/banks/msb.webp') },
  { id: 'shb', name: 'SHB', shortName: 'SHB', scheme: 'https://dl.vietqr.io/pay?app=shb', color: '#cc0000', logo: require('@/assets/banks/shb.webp') },
  { id: 'seab', name: 'SeABank', shortName: 'SEAB', scheme: 'https://dl.vietqr.io/pay?app=seab', color: '#e31837', logo: require('@/assets/banks/seabank.webp') },
  { id: 'momo', name: 'Ví MoMo', shortName: 'MOMO', scheme: 'momo://', color: '#ae2070', logo: require('@/assets/banks/momo.png') },
  { id: 'zalopay', name: 'ZaloPay', shortName: 'ZALO', scheme: 'zalopay://', color: '#0068ff', logo: require('@/assets/banks/zalopay.png') },
];

// ─── Types ─────────────────────────────────────────────────────────────────

type PaymentMethod = 'momo' | 'bank';

interface SelectedPackage {
  id: string;
  credits: number;
  price: string;
  priceNumber: number;
}

// ─── Helper ────────────────────────────────────────────────────────────────

function generateOrderRef(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function extractPriceNumber(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
}

// ─── Sub-components (all inlined per spec) ─────────────────────────────────

interface PaymentMethodModalProps {
  visible: boolean;
  pkg: SelectedPackage | null;
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
}

function PaymentMethodModal({ visible, pkg, onSelect, onClose }: PaymentMethodModalProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['42%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={onClose}
      backgroundStyle={{ backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: COLORS.secondary, opacity: 0.4 }}
    >
      <BottomSheetView className="px-5 pt-2 pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-base font-bold text-on-surface">Chọn phương thức thanh toán</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <XMarkIcon size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-secondary mb-5">
          {pkg?.credits} Credits · {pkg?.price}
        </Text>

        {/* MoMo option */}
        <TouchableOpacity
          onPress={() => onSelect('momo')}
          className="flex-row items-center gap-4 bg-surface-container rounded-2xl px-4 py-4 mb-3"
        >
          <Image
            source={require('@/assets/momo-logo.png')}
            className="w-11 h-11 rounded-2xl"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-sm font-semibold text-on-surface">Ví MoMo</Text>
            <Text className="text-xs text-secondary mt-0.5">Thanh toán qua ví điện tử MoMo</Text>
          </View>
          <ChevronRightIcon size={18} color={COLORS.secondary} />
        </TouchableOpacity>

        {/* Bank transfer option */}
        <TouchableOpacity
          onPress={() => onSelect('bank')}
          className="flex-row items-center gap-4 bg-surface-container rounded-2xl px-4 py-4"
        >
          <View className="w-11 h-11 rounded-2xl bg-surface-container items-center justify-center">
            <Image
              source={require('@/assets/bank-transfer.png')}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-on-surface">Chuyển khoản ngân hàng</Text>
            <Text className="text-xs text-secondary mt-0.5">Quét QR hoặc chuyển khoản thủ công</Text>
          </View>
          <ChevronRightIcon size={18} color={COLORS.secondary} />
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

// ─── Bank bottom sheet ──────────────────────────────────────────────────────

interface BankBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

function BankBottomSheet({ visible, onClose }: BankBottomSheetProps) {
  const handleOpenBank = useCallback((bank: typeof VIETNAM_BANKS[number]) => {
    Linking.openURL(bank.scheme).catch(() => {
      Alert.alert(
        'Không tìm thấy ứng dụng',
        `Không tìm thấy ứng dụng ${bank.name} trên thiết bị này. Vui lòng cài đặt ứng dụng hoặc dùng trình duyệt.`,
        [{ text: 'OK' }],
      );
    });
  }, []);

  // Dùng React Native Modal (transparent + slide) thay BottomSheetModal vì
  // BottomSheetModal dùng portal render ngoài window của parent Modal → bị khuất
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View className="bg-surface rounded-t-3xl pt-5 pb-8" style={{ maxHeight: 520 }}>
            <View className="w-10 h-1 rounded-full bg-secondary/30 self-center mb-4" />
            <View className="flex-row items-center justify-between px-5 mb-2">
              <Text className="text-base font-bold text-on-surface">Chọn ứng dụng ngân hàng</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <XMarkIcon size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {VIETNAM_BANKS.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  onPress={() => handleOpenBank(bank)}
                  className="flex-row items-center gap-3 px-5 py-3"
                >
                  {bank.logo ? (
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#edeeed' }}
                    >
                      <Image source={bank.logo} style={{ width: 32, height: 32 }} resizeMode="contain" />
                    </View>
                  ) : (
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: bank.color }}
                    >
                      <Text className="text-white text-[10px] font-black">{bank.shortName}</Text>
                    </View>
                  )}
                  <Text className="flex-1 text-sm font-medium text-on-surface">{bank.name}</Text>
                  <ChevronRightIcon size={16} color={COLORS.secondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── QR Payment Screen (as modal) ──────────────────────────────────────────

interface QRPaymentModalProps {
  visible: boolean;
  method: PaymentMethod;
  pkg: SelectedPackage | null;
  orderRef: string;
  onComplete: () => void;
  onClose: () => void;
}

/** Aligns with @react-native-camera-roll/camera-roll README (API 33+ → READ_MEDIA_*). */
const ensureAndroidSavePhotoPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }
  const sdk = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version), 10);

  if (sdk >= 33) {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, {
      title: 'Quyền ảnh',
      message: 'ModaMi cần quyền truy cập ảnh để lưu mã QR vào thư viện.',
      buttonPositive: 'Cho phép',
      buttonNegative: 'Từ chối',
    });
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Không có quyền', 'Vui lòng cấp quyền ảnh trong cài đặt.');
      return false;
    }
    return true;
  }

  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
    title: 'Quyền lưu ảnh',
    message: 'ModaMi cần quyền để lưu mã QR vào thư viện ảnh.',
    buttonPositive: 'Cho phép',
    buttonNegative: 'Từ chối',
  });
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    Alert.alert('Không có quyền', 'Vui lòng cấp quyền lưu ảnh trong cài đặt.');
    return false;
  }
  return true;
};

const ensureIOSSavePhotoPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') {
    return true;
  }
  const status = await iosRequestAddOnlyGalleryPermission();
  if (status === 'denied' || status === 'blocked' || status === 'unavailable') {
    Alert.alert('Không có quyền', 'Vui lòng cấp quyền ảnh trong Cài đặt để lưu mã QR.');
    return false;
  }
  return true;
};

function QRPaymentModal({ visible, method, pkg, orderRef, onComplete, onClose }: QRPaymentModalProps) {
  const [bankSheetVisible, setBankSheetVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const paymentRef = `MODAMI${orderRef}`;
  // MoMo: qr_only vì không có compact template
  // Bank: compact template — embed sẵn logo ngân hàng, số TK, tên, số tiền, nội dung CK vào ảnh
  const qrUrl = method === 'momo'
    ? `https://img.vietqr.io/image/MOMO-0123456789-qr_only.png?amount=${pkg?.priceNumber ?? 0}&addInfo=${paymentRef}&accountName=DAO+VAN+THUONG`
    : `https://img.vietqr.io/image/970415-105870820196-compact2.png?amount=${pkg?.priceNumber ?? 0}&addInfo=${paymentRef}&accountName=DAO+VAN+THUONG`;

  const handleCopyField = async (value: string, label: string) => {
    try {
      await Share.share({ message: value, title: label });
    } catch {
      // user cancelled share — no-op
    }
  };

  const handleSaveQR = async () => {
    if (isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      if (!(await ensureAndroidSavePhotoPermission())) {
        return;
      }
      if (!(await ensureIOSSavePhotoPermission())) {
        return;
      }
      // Giống mẫu: ghi file local rồi CameraRoll.save(file://…) — API chỉ khuyến nghị URI local, tránh lỗi HTTPS / data: trên iOS.
      const filePath = `${RNFS.CachesDirectoryPath}/modami-qr-${Date.now()}.png`;
      const { promise } = RNFS.downloadFile({ fromUrl: qrUrl, toFile: filePath });
      const { statusCode } = await promise;
      if (statusCode < 200 || statusCode >= 300) {
        throw new Error(`Tải ảnh thất bại (HTTP ${statusCode})`);
      }
      const fileUri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;
      try {
        await CameraRoll.save(fileUri, { type: 'photo' });
      } catch (saveError) {
        // Known iOS bug: first-time permission grant causes CameraRoll.save() to throw
        // "Unknown error from a native module" even though the photo IS saved successfully.
        // Re-throw only if it's a real error (not this false-positive).
        if (Platform.OS !== 'ios' || !String(saveError).includes('Unknown error from a native module')) {
          throw saveError;
        }
      }
      RNFS.unlink(filePath).catch(() => {});
      Alert.alert('Đã lưu!', 'Mã QR đã được lưu vào thư viện ảnh.');
    } catch (error) {
      Alert.alert('Không lưu được ảnh', String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenApp = () => {
    if (method === 'momo') {
      Linking.openURL('momo://').catch(() => {
        Alert.alert(
          'Không tìm thấy ứng dụng',
          'Không tìm thấy ứng dụng MoMo trên thiết bị này. Vui lòng cài đặt ứng dụng hoặc dùng trình duyệt.',
          [{ text: 'OK' }],
        );
      });
    } else {
      setBankSheetVisible(true);
    }
  };

  const bankInfoRows = [
    { label: 'Ngân hàng', value: method === 'momo' ? 'Ví MoMo' : 'Vietinbank' },
    { label: 'Số tài khoản', value: method === 'momo' ? '0123456789' : '105870820196' },
    { label: 'Tên TK', value: method === 'momo' ? 'MODAMI OFFICIAL' : 'DAO VAN THUONG' },
    { label: 'Số tiền', value: pkg?.price ?? '' },
    { label: 'Nội dung CK', value: paymentRef },
  ];

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
        <View className="flex-1 bg-background">
          {/* Header */}
          <View
            className="flex-row items-center justify-between px-5 py-4 bg-surface"
            style={Platform.select({
              ios: { paddingTop: 56 },
              android: { paddingTop: 16 },
            })}
          >
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <XMarkIcon size={22} color={COLORS.onSurface} />
            </TouchableOpacity>
            <Text className="text-base font-bold text-on-surface">
              {method === 'momo' ? 'Thanh toán MoMo' : 'Chuyển khoản ngân hàng'}
            </Text>
            <View style={{ width: 22 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-10">
            {/* QR block */}
            <View className="items-center mt-6 mx-5">
              <View
                className="bg-surface rounded-3xl p-5 items-center w-full"
                style={cardShadow}
              >
                <Text className="text-xs font-medium text-secondary mb-3 uppercase tracking-widest">
                  Quét để thanh toán
                </Text>

                <View className="rounded-2xl overflow-hidden">
                  <Image
                    source={{ uri: qrUrl }}
                    style={method === 'bank' ? { width: 260, height: 380 } : { width: 220, height: 220 }}
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-row items-center gap-2 mt-4">
                  <SparklesIcon size={14} color={COLORS.primary} />
                  <Text className="text-sm font-bold text-primary">{pkg?.credits} Credits</Text>
                  <Text className="text-sm text-secondary">·</Text>
                  <Text className="text-sm font-bold text-on-surface">{pkg?.price}</Text>
                </View>

                <Text className="text-xs text-secondary mt-1">Mã đơn: {paymentRef}</Text>
              </View>
            </View>

            {/* Instruction box */}
            <View
              className="mx-5 mt-4 rounded-2xl p-4 flex-row gap-3"
              style={{ backgroundColor: '#e8f0fe' }}
            >
              <InformationCircleIcon size={18} color="#1a56db" style={{ marginTop: 1 }} />
              <Text className="flex-1 text-xs leading-5" style={{ color: '#1a56db' }}>
                Hướng dẫn: Mở ứng dụng ngân hàng → chọn "Quét QR" hoặc "Chuyển tiền" → quét mã QR trên hoặc nhập thông tin thủ công. Giao dịch sẽ được xác nhận tự động trong vòng 1-3 phút.
              </Text>
            </View>

            {/* Thông tin chuyển khoản thủ công — bank: chỉ các trường quan trọng để copy */}
            {method === 'bank' && (
              <View className="mx-5 mt-4 bg-surface rounded-2xl overflow-hidden" style={cardShadow}>
                {[
                  { label: 'Ngân hàng', value: 'Vietinbank' },
                  { label: 'Chủ tài khoản', value: 'DAO VAN THUONG' },
                  { label: 'Số tài khoản', value: '105870820196' },
                  { label: 'Nội dung CK', value: paymentRef },
                  { label: 'Số tiền', value: pkg?.price ?? '' },
                ].map((row, i) => (
                  <View key={row.label}>
                    {i > 0 && <View className="h-px bg-surface-container" />}
                    <View className="flex-row items-center px-4 py-3">
                      <Text className="text-xs text-secondary w-28">{row.label}</Text>
                      <Text className="flex-1 text-xs font-semibold text-on-surface">{row.value}</Text>
                      <TouchableOpacity
                        onPress={() => handleCopyField(row.value, row.label)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <ClipboardDocumentIcon size={16} color={COLORS.secondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Bank info card — MoMo */}
            {method === 'momo' && <View className="mx-5 mt-4 bg-surface rounded-2xl overflow-hidden" style={cardShadow}>
              {bankInfoRows.map((row, i) => (
                <View key={row.label}>
                  {i > 0 && <View className="h-px bg-surface-container" />}
                  <View className="flex-row items-center px-4 py-3">
                    <Text className="text-xs text-secondary w-28">{row.label}</Text>
                    <Text className="flex-1 text-xs font-semibold text-on-surface">{row.value}</Text>
                    <TouchableOpacity
                      onPress={() => handleCopyField(row.value, row.label)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <ClipboardDocumentIcon size={16} color={COLORS.secondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>}

            {/* Action buttons */}
            <View className="mx-5 mt-5 gap-3">
              <TouchableOpacity
                onPress={handleSaveQR}
                disabled={isSaving}
                className="bg-surface-container rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
                style={isSaving ? { opacity: 0.6 } : undefined}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={COLORS.secondary} />
                ) : null}
                <Text className="text-sm font-semibold text-on-surface">
                  {isSaving ? 'Đang lưu...' : 'Lưu mã QR'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenApp}
                className="bg-primary rounded-2xl py-3.5 items-center"
              >
                <Text className="text-sm font-bold text-white">
                  {method === 'momo' ? 'Mở ứng dụng MoMo' : 'Mở ứng dụng ngân hàng'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onComplete}
                className="py-3 items-center"
              >
                <Text className="text-sm font-semibold text-primary">Đã thanh toán xong</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* BankBottomSheet renders via @gorhom/bottom-sheet Portal — appears above Modal */}
          <BankBottomSheet
            visible={bankSheetVisible}
            onClose={() => setBankSheetVisible(false)}
          />
        </View>
    </Modal>
  );
}

// ─── Main screen ────────────────────────────────────────────────────────────

export function CreditsScreen(_props: Props) {
  const balance = useCreditStore((s) => s.balance);
  const addCredit = useCreditStore((s) => s.addCredit);

  const { data: packagesData, isLoading: packagesLoading, isRefetching: packagesRefetching, refetch: refetchPackages } = useCreditPackages();
  const { data: historyData, isLoading: historyLoading, isRefetching: historyRefetching, refetch: refetchHistory } = useCreditHistory();
  const purchaseMutation = usePurchaseCredits();

  const packages = packagesData?.data ?? [];
  const history = historyData?.data ?? [];
  const isLoading = packagesLoading || historyLoading;
  const isRefetching = packagesRefetching || historyRefetching;

  // Payment flow state
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [paymentMethodModalVisible, setPaymentMethodModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [qrModalVisible, setQRModalVisible] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const onRefresh = useCallback(async () => {
    await Promise.all([refetchPackages(), refetchHistory()]);
  }, [refetchPackages, refetchHistory]);

  const handlePurchase = useCallback((packageId: string, credits: number, price: string) => {
    const priceNumber = extractPriceNumber(price);
    setSelectedPackage({ id: packageId, credits, price, priceNumber });
    setOrderRef(generateOrderRef());
    setPaymentMethodModalVisible(true);
  }, []);

  const handleSelectMethod = useCallback((method: PaymentMethod) => {
    setSelectedMethod(method);
    setPaymentMethodModalVisible(false);
    setQRModalVisible(true);
  }, []);

  const handleClosePaymentMethod = useCallback(() => {
    setPaymentMethodModalVisible(false);
    // Không xoá selectedPackage ở đây — QRPaymentModal vẫn cần nó
    // selectedPackage chỉ bị xoá khi hoàn tất hoặc huỷ QR flow
  }, []);

  const handleCloseQR = useCallback(() => {
    setQRModalVisible(false);
    setSelectedMethod(null);
    setSelectedPackage(null);
  }, []);

  const handlePaymentComplete = useCallback(() => {
    if (!selectedPackage) return;
    const { credits, id } = selectedPackage;

    // Add credits to balance
    addCredit(credits);

    // Also fire the mock mutation to refresh history
    purchaseMutation.mutate(id);

    // Close all modals
    setQRModalVisible(false);
    setPaymentMethodModalVisible(false);
    setSelectedMethod(null);
    setSelectedPackage(null);

    Alert.alert(
      'Thanh toán thành công!',
      `${credits} credits đã được cộng vào tài khoản.`,
      [{ text: 'Tuyệt vời!' }],
    );
  }, [selectedPackage, addCredit, purchaseMutation]);

  if (isLoading) return <CreditsSkeleton />;

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* ── Balance card ── */}
        <View>
          <View className="mx-5 mt-4 bg-primary rounded-3xl p-6 overflow-hidden"
            style={Platform.select({
              ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24 },
              android: { elevation: 6 },
            })}
          >
            <View
              className="absolute bg-white/10 rounded-full"
              style={{ width: 200, height: 200, top: -60, right: -60 }}
            />
            <View
              className="absolute bg-white/5 rounded-full"
              style={{ width: 120, height: 120, bottom: -30, left: 20 }}
            />

            <View className="flex-row items-center gap-2 mb-4">
              <SparklesIcon size={16} color="rgba(255,255,255,0.7)" />
              <Text className="text-white/70 text-sm font-medium uppercase tracking-widest">M-Credit</Text>
            </View>

            <Text className="text-white text-[52px] font-black leading-none">{formatCredits(balance)}</Text>
            <Text className="text-white/60 text-sm mt-1">credits khả dụng</Text>

            <View className="flex-row gap-2 mt-5">
              <View className="flex-row items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <ShieldCheckIcon size={12} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-xs font-medium">Không hết hạn</Text>
              </View>
              <View className="flex-row items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <BoltIcon size={12} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-xs font-medium">Dùng ngay</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── How credits work ── */}
        <View className="mx-5 mt-4">
          <View className="bg-surface rounded-2xl p-4 gap-3" style={cardShadow}>
            <Text className="text-sm font-bold text-on-surface">Credits hoạt động như thế nào?</Text>
            {HOW_IT_WORKS.map((item) => (
              <View key={item.text} className="flex-row items-center gap-3">
                <Text className="text-base">{item.icon}</Text>
                <Text className="flex-1 text-sm text-secondary">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Buy credits ── */}
        <View className="mx-5 mt-5">
          <Text className="text-sm font-bold text-on-surface mb-3">Nạp M-Credit</Text>
          <View className="gap-2.5">
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                onPress={() => handlePurchase(pkg.id, pkg.credits, pkg.price)}
                disabled={purchaseMutation.isPending}
                className="bg-surface rounded-2xl px-4 py-4 flex-row items-center justify-between"
                style={cardShadow}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <SparklesIcon size={18} color={COLORS.primary} />
                  </View>
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-bold text-on-surface">{pkg.credits} Credits</Text>
                      {pkg.tag && (
                        <View className={`rounded-full px-2 py-0.5 ${pkg.tag === 'Phổ biến' ? 'bg-primary' : 'bg-primary/10'}`}>
                          <Text className={`text-[10px] font-bold ${pkg.tag === 'Phổ biến' ? 'text-white' : 'text-primary'}`}>
                            {pkg.tag}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-secondary mt-0.5">
                      {(parseFloat(pkg.price.replace(/[^0-9]/g, '')) / pkg.credits).toFixed(0)}₫ / credit
                    </Text>
                  </View>
                </View>
                <View className={`rounded-full px-4 py-2 ${purchaseMutation.isPending ? 'bg-primary/50' : 'bg-primary'}`}>
                  {purchaseMutation.isPending && purchaseMutation.variables === pkg.id
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text className="text-white text-sm font-bold">{pkg.price}</Text>
                  }
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-xs text-secondary text-center mt-3">
            Thanh toán qua MoMo hoặc chuyển khoản ngân hàng
          </Text>
        </View>

        {/* ── Transaction history ── */}
        <View className="mx-5 mt-5">
          <Text className="text-sm font-bold text-on-surface mb-3">Lịch sử giao dịch</Text>
          <View className="bg-surface rounded-2xl overflow-hidden" style={cardShadow}>
            {history.map((item, i) => (
              <View key={item.id}>
                {i > 0 && <View className="h-px bg-surface-container mx-4" />}
                <View className="flex-row items-center px-4 py-3 gap-3">
                  <View className={`w-9 h-9 rounded-full items-center justify-center ${item.type === 'earn' ? 'bg-primary/10' : 'bg-surface-container'}`}>
                    {item.type === 'earn'
                      ? <ArrowDownLeftIcon size={16} color={COLORS.primary} />
                      : <ArrowUpRightIcon size={16} color={COLORS.secondary} />
                    }
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-on-surface" numberOfLines={1}>{item.label}</Text>
                    <Text className="text-xs text-secondary mt-0.5">{item.date}</Text>
                  </View>
                  <Text className={`text-sm font-bold ${item.type === 'earn' ? 'text-primary' : 'text-secondary'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upgrade CTA */}
        <View className="mx-5 mt-4">
          <View className="bg-[#1a2e3d] rounded-2xl p-5 flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <TrophyIcon size={22} color="#d4af37" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-sm">Nâng cấp lên Style / Elite</Text>
              <Text className="text-white/60 text-xs mt-0.5">Nhận đến 300 credits miễn phí mỗi tháng</Text>
            </View>
            <View className="bg-white/15 rounded-full px-3 py-1.5">
              <Text className="text-white text-xs font-bold">Xem</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Payment method selection bottom sheet */}
      <PaymentMethodModal
        visible={paymentMethodModalVisible}
        pkg={selectedPackage}
        onSelect={handleSelectMethod}
        onClose={handleClosePaymentMethod}
      />

      {/* QR payment modal */}
      <QRPaymentModal
        visible={qrModalVisible}
        method={selectedMethod ?? 'bank'}
        pkg={selectedPackage}
        orderRef={orderRef}
        onComplete={handlePaymentComplete}
        onClose={handleCloseQR}
      />
    </>
  );
}
