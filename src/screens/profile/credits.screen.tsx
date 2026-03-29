import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import {
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  TrophyIcon,
} from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { CreditsSkeleton } from './credits-skeleton.component';
import { useCreditStore } from '@/store/app.store';
import { formatCredits } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';
import { useCreditPackages, useCreditHistory, usePurchaseCredits } from '@/hooks/queries/credit.queries';

type Props = RootStackScreenProps<'Credits'>;

const cardShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  android: { elevation: 2 },
});

const HOW_IT_WORKS = [
  { icon: '🔓', text: 'Xem thông tin liên hệ người bán' },
  { icon: '💚', text: 'Nhận credits khi bán hàng thành công' },
  { icon: '👑', text: 'Style & Elite nhận bonus credits hàng tháng' },
];

export function CreditsScreen(_props: Props) {
  const balance = useCreditStore((s) => s.balance);

  const { data: packagesData, isLoading: packagesLoading, isRefetching: packagesRefetching, refetch: refetchPackages } = useCreditPackages();
  const { data: historyData, isLoading: historyLoading, isRefetching: historyRefetching, refetch: refetchHistory } = useCreditHistory();
  const purchaseMutation = usePurchaseCredits();

  const packages = packagesData?.data ?? [];
  const history = historyData?.data ?? [];
  const isLoading = packagesLoading || historyLoading;
  const isRefetching = packagesRefetching || historyRefetching;

  const onRefresh = useCallback(async () => {
    await Promise.all([refetchPackages(), refetchHistory()]);
  }, [refetchPackages, refetchHistory]);

  const handlePurchase = useCallback((packageId: string, credits: number, price: string) => {
    Alert.alert(
      'Xác nhận mua',
      `Mua ${credits} Credits với giá ${price}?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Mua ngay',
          onPress: () => purchaseMutation.mutate(packageId),
        },
      ],
    );
  }, [purchaseMutation]);

  if (isLoading) return <CreditsSkeleton />;

  return (
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
          Thanh toán qua VNPay, Momo, thẻ ngân hàng · Sắp ra mắt
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
  );
}
