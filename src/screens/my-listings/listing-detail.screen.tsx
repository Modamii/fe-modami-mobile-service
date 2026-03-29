import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
} from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useListing } from '@/hooks/queries/listing.queries';
import { formatPrice, timeAgo } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';
import { SkeletonBox } from '@/components/ui/skeleton.component';
import type { ListingStatus, MyListing } from '@/types/app.type';

type Props = RootStackScreenProps<'ListingDetail'>;

const cardShadow = Platform.select({
  ios: { shadowColor: '#191c1c', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  android: { elevation: 2 },
});

const CONDITION_LABEL: Record<string, string> = {
  new: 'Mới',
  'like-new': 'Như mới',
  good: 'Còn tốt',
  fair: 'Đã dùng',
};

type TimelineStep = {
  key: ListingStatus | 'submitted';
  label: string;
  sublabel?: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'submitted', label: 'Đã gửi' },
  { key: 'under_review', label: 'Đang xét duyệt' },
  { key: 'approved', label: 'Được duyệt' },
];

function getTimelineState(status: ListingStatus): { activeIndex: number; isRejected: boolean } {
  if (status === 'pending') return { activeIndex: 0, isRejected: false };
  if (status === 'under_review') return { activeIndex: 1, isRejected: false };
  if (status === 'rejected') return { activeIndex: 1, isRejected: true };
  if (status === 'approved' || status === 'sold') return { activeIndex: 2, isRejected: false };
  return { activeIndex: 0, isRejected: false };
}

function TimelineSection({ listing }: { listing: MyListing }) {
  const { activeIndex, isRejected } = getTimelineState(listing.status);

  return (
    <View style={[{ backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 0 }, cardShadow]}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.onSurface, marginBottom: 16 }}>
        Trạng thái xét duyệt
      </Text>
      {TIMELINE_STEPS.map((step, idx) => {
        const isDone = idx < activeIndex || (idx === 2 && activeIndex === 2);
        const isActive = idx === activeIndex;
        const isLast = idx === TIMELINE_STEPS.length - 1;
        const showReject = isRejected && idx === 1;

        return (
          <View key={step.key} style={{ flexDirection: 'row', gap: 12 }}>
            {/* Line + dot */}
            <View style={{ alignItems: 'center', width: 24 }}>
              <View style={{
                width: 24, height: 24, borderRadius: 12,
                backgroundColor: showReject ? '#fee2e2' : isDone || isActive ? COLORS.primary : '#e0e0de',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {showReject
                  ? <ExclamationCircleIcon size={14} color="#991b1b" />
                  : isDone || isActive
                    ? <CheckCircleIcon size={14} color="#fff" />
                    : <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#b0b0ae' }} />
                }
              </View>
              {!isLast && (
                <View style={{ width: 2, flex: 1, backgroundColor: isDone ? COLORS.primary : '#e0e0de', marginVertical: 4 }} />
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: showReject ? '#991b1b' : isDone || isActive ? COLORS.onSurface : COLORS.secondary }}>
                {showReject ? 'Từ chối' : step.label}
              </Text>
              {isActive && !showReject && (
                <Text style={{ fontSize: 11, color: COLORS.secondary, marginTop: 2 }}>
                  {listing.status === 'pending' ? timeAgo(listing.submittedAt) : timeAgo(listing.updatedAt)}
                </Text>
              )}
              {showReject && listing.adminFeedback && (
                <Text style={{ fontSize: 11, color: '#991b1b', marginTop: 2 }}>
                  {timeAgo(listing.adminFeedback.reviewedAt)}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function AdminFeedbackSection({ listing }: { listing: MyListing }) {
  if (!listing.adminFeedback) return null;

  const fb = listing.adminFeedback;

  return (
    <View style={[{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }, cardShadow]}>
      {/* Header */}
      <View style={{ backgroundColor: '#fee2e2', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <ExclamationCircleIcon size={16} color="#991b1b" />
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#991b1b' }}>Phản hồi từ ModaMi</Text>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        {/* Reason category */}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: COLORS.secondary, width: 80 }}>Lý do</Text>
          <View style={{ flex: 1, backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#991b1b' }}>{fb.reasonCategory}</Text>
          </View>
        </View>

        {/* Notes */}
        <View>
          <Text style={{ fontSize: 12, color: COLORS.secondary, marginBottom: 6 }}>Ghi chú từ kiểm duyệt viên</Text>
          <Text style={{ fontSize: 13, color: COLORS.onSurface, lineHeight: 20 }}>{fb.notes}</Text>
        </View>

        {/* Suggested action */}
        {fb.suggestedAction && (
          <View style={{ backgroundColor: '#f0fdf4', borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontSize: 18 }}>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#166534', marginBottom: 2 }}>Gợi ý</Text>
              <Text style={{ fontSize: 12, color: '#166534' }}>{fb.suggestedAction}</Text>
            </View>
          </View>
        )}

        {/* Reviewer + date */}
        <Text style={{ fontSize: 11, color: COLORS.secondary }}>
          Xét duyệt bởi {fb.reviewerName} · {timeAgo(fb.reviewedAt)}
        </Text>
      </View>
    </View>
  );
}

function LoadingSkeleton() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9f9f8' }} contentContainerStyle={{ padding: 20, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonBox width={80} height={80} borderRadius={12} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox width="70%" height={14} borderRadius={5} />
          <SkeletonBox width="40%" height={16} borderRadius={5} />
          <SkeletonBox width={80} height={22} borderRadius={11} />
        </View>
      </View>
      <SkeletonBox width="100%" height={120} borderRadius={16} />
      <SkeletonBox width="100%" height={160} borderRadius={16} />
    </ScrollView>
  );
}

export function ListingDetailScreen({ navigation, route }: Props) {
  const { listingId } = route.params;
  const { data, isLoading } = useListing(listingId);
  const listing = data?.data ?? null;

  if (isLoading) return <LoadingSkeleton />;

  if (!listing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: COLORS.secondary }}>Không tìm thấy bài đăng</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f9f9f8' }}
      contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Product info card */}
      <View style={[{ backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12 }, cardShadow]}>
        <Image
          source={{ uri: listing.images[0] }}
          style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: '#f5f5f4' }}
          resizeMode="cover"
        />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.onSurface }} numberOfLines={2}>
            {listing.title}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.primary }}>
            {formatPrice(listing.price)}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Text style={{ fontSize: 12, color: COLORS.secondary }}>{listing.category}</Text>
            <Text style={{ fontSize: 12, color: COLORS.secondary }}>·</Text>
            <Text style={{ fontSize: 12, color: COLORS.secondary }}>{CONDITION_LABEL[listing.condition]}</Text>
          </View>
        </View>
      </View>

      {/* Meta info */}
      <View style={[{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 }, cardShadow]}>
        {[
          { label: 'Ngày gửi', value: timeAgo(listing.submittedAt) },
          { label: 'Cập nhật', value: timeAgo(listing.updatedAt) },
          ...(listing.productId ? [{ label: 'Mã sản phẩm', value: listing.productId }] : []),
        ].map((row, i, arr) => (
          <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: '#f0f0ee' }}>
            <Text style={{ fontSize: 13, color: COLORS.secondary }}>{row.label}</Text>
            <Text style={{ fontSize: 13, fontWeight: '500', color: COLORS.onSurface }}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Timeline */}
      <TimelineSection listing={listing} />

      {/* Admin feedback (rejected only) */}
      <AdminFeedbackSection listing={listing} />

      {/* CTAs */}
      {listing.status === 'rejected' && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Main', { screen: 'PostListing' })}
          style={{ backgroundColor: COLORS.primary, borderRadius: 24, height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 4 }}
        >
          <ArrowPathIcon size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Chỉnh sửa & Gửi lại</Text>
        </TouchableOpacity>
      )}

      {listing.status === 'approved' && listing.productId && (
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { productId: listing.productId! })}
          style={{ backgroundColor: COLORS.primary, borderRadius: 24, height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 4 }}
        >
          <ShoppingBagIcon size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Xem bài đăng live</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
