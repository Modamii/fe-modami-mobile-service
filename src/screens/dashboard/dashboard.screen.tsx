import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { StarIcon, PencilSquareIcon } from 'react-native-heroicons/solid';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useAuthStore, useCreditStore } from '@/store/app.store';
import { COLORS } from '@/constants/app.constants';
import { formatCredits, formatPrice } from '@/lib/utils.helper';
import { useDashboard } from '@/hooks/queries/dashboard.queries';
import { DashboardSkeleton } from './dashboard-skeleton.component';

type Props = RootStackScreenProps<'Dashboard'>;

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

export function DashboardScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const balance = useCreditStore((s) => s.balance);
  const { data, isLoading, isRefetching, refetch } = useDashboard();

  const onRefresh = useCallback(async () => { await refetch(); }, [refetch]);

  if (!user) return null;

  if (isLoading) return <DashboardSkeleton />;

  const listings = data?.data.listings ?? [];
  const featured = data?.data.featured ?? [];
  const contacts = data?.data.contacts ?? [];
  const creditHistory = data?.data.creditHistory ?? [];
  const sellerRating = 4.8;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <Text className="text-xs font-semibold text-secondary uppercase tracking-widest mb-4">
          Tổng quan cửa hàng
        </Text>

        {/* Hồ sơ + số dư — tương đương hàng đầu dashboard web */}
        <View className="bg-surface rounded-3xl p-4 gap-4 mb-5" style={cardShadow}>
          <View className="flex-row items-center gap-3">
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} className="w-16 h-16 rounded-2xl" />
            ) : (
              <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center">
                <Text className="text-white text-2xl font-bold">{user.name.charAt(0)}</Text>
              </View>
            )}
            <View className="flex-1 min-w-0">
              <Text className="text-lg font-bold text-on-surface" numberOfLines={1}>
                {user.name}
              </Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <StarIcon size={14} color="#e8a317" />
                <Text className="text-sm text-secondary">
                  {sellerRating} · Người bán
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Credits')}
            activeOpacity={0.9}
            className="bg-primary rounded-2xl px-4 py-4"
            accessibilityRole="button"
            accessibilityLabel="Xem số dư Credits"
          >
            <Text className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
              Số dư Credit
            </Text>
            <Text className="text-2xl font-black text-white mt-1">
              {formatCredits(balance)} Credits
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tin đăng của tôi */}
        <View className="mb-5">
          <Text className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">
            Tin đăng của tôi
          </Text>
          <View className="bg-surface rounded-3xl overflow-hidden" style={cardShadow}>
            {listings.map((row, index) => (
              <View
                key={row.id}
                className={`flex-row items-center gap-3 px-4 py-3 ${
                  index < listings.length - 1 ? 'border-b border-surface-container' : ''
                }`}
              >
                <Image
                  source={{ uri: row.image }}
                  className="w-14 h-14 rounded-xl bg-surface-container"
                />
                <View className="flex-1 min-w-0">
                  <Text className="text-sm font-semibold text-on-surface" numberOfLines={2}>
                    {row.title}
                  </Text>
                  <Text className="text-xs text-secondary mt-0.5">
                    {formatPrice(row.price)} · {row.views} lượt xem
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Main', { screen: 'PostListing' })
                  }
                  className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1.5"
                  accessibilityRole="button"
                  accessibilityLabel={`Chỉnh sửa ${row.title}`}
                >
                  <PencilSquareIcon size={14} color={COLORS.primary} />
                  <Text className="text-xs font-bold text-primary">Sửa</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ModaMi Pro */}
        <View
          className="bg-surface-container rounded-3xl p-4 mb-5 border border-primary/20"
          style={cardShadow}
        >
          <Text className="text-base font-bold text-on-surface">Nâng cấp Shop Pro</Text>
          <Text className="text-sm text-secondary mt-1 leading-5">
            Ưu tiên hiển thị, badge uy tín và công cụ quản lý tin nâng cao — giống gói trên web.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Membership')}
            className="bg-primary rounded-xl py-3 mt-3 items-center"
            activeOpacity={0.9}
          >
            <Text className="text-on-primary font-bold">Xem gói Pro</Text>
          </TouchableOpacity>
        </View>

        {/* Tin nổi bật */}
        <View className="mb-5">
          <Text className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">
            Tin đăng nổi bật
          </Text>
          <View className="bg-surface rounded-3xl p-4 gap-3" style={cardShadow}>
            {featured.map((f) => (
              <View
                key={f.id}
                className="flex-row items-center justify-between gap-2 py-1 border-b border-surface-container last:border-0"
              >
                <Text className="text-sm text-on-surface flex-1" numberOfLines={1}>
                  {f.title}
                </Text>
                <View
                  className={`rounded-full px-2 py-0.5 ${
                    f.badge === 'hot' ? 'bg-orange-500/15' : 'bg-surface-highest'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold uppercase ${
                      f.badge === 'hot' ? 'text-orange-700' : 'text-secondary'
                    }`}
                  >
                    {f.badge === 'hot' ? 'Hot' : 'Hết hạn'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Liên hệ & giao dịch */}
        <View className="mb-5">
          <Text className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">
            Liên hệ & giao dịch mới
          </Text>
          <View className="bg-surface rounded-3xl overflow-hidden" style={cardShadow}>
            {contacts.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                onPress={() =>
                  navigation.navigate('Conversation', {
                    conversationId: `dash-${c.id}`,
                    participantName: c.name,
                  })
                }
                className={`flex-row items-center gap-3 px-4 py-3 ${
                  i < contacts.length - 1 ? 'border-b border-surface-container' : ''
                }`}
                activeOpacity={0.75}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${c.accent}22` }}
                >
                  <Text className="text-sm font-bold" style={{ color: c.accent }}>
                    {c.initials}
                  </Text>
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-sm font-semibold text-on-surface">{c.name}</Text>
                  <Text className="text-xs text-secondary mt-0.5" numberOfLines={1}>
                    {c.preview}
                  </Text>
                </View>
                <ChevronRightIcon size={16} color={COLORS.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lịch sử nạp Credit */}
        <View className="mb-5">
          <Text className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">
            Lịch sử nạp Credit
          </Text>
          <View className="bg-surface rounded-3xl p-4" style={cardShadow}>
            {creditHistory.map((h) => (
              <View key={h.id} className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold text-on-surface">{h.label}</Text>
                  <Text className="text-xs text-secondary mt-0.5">{h.dateLabel}</Text>
                </View>
                <Text className="text-sm font-bold text-primary">+{h.amount} Credits</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cài đặt nhanh */}
        <View>
          <Text className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">
            Cài đặt nhanh
          </Text>
          <View className="bg-surface rounded-3xl overflow-hidden" style={cardShadow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-surface-container"
            >
              <Text className="text-base text-on-surface">Chỉnh sửa hồ sơ</Text>
              <ChevronRightIcon size={18} color={COLORS.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              className="flex-row items-center justify-between px-4 py-3.5 border-b border-surface-container"
            >
              <Text className="text-base text-on-surface">Thông báo ứng dụng</Text>
              <ChevronRightIcon size={18} color={COLORS.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
                  { text: 'Huỷ', style: 'cancel' },
                  { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
                ])
              }
              className="flex-row items-center justify-between px-4 py-3.5"
            >
              <Text className="text-base text-red-500 font-medium">Đăng xuất</Text>
              <ChevronRightIcon size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
