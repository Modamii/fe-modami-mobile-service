import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, BookOpen, TrendingUp } from 'lucide-react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import {
  TRENDS_PAGE_HERO,
  TRENDS_FORECAST_LABEL,
  TRENDS_FORECAST_SUBTITLE,
  TRENDS_WEB_URL,
  mockTrendSpotlights,
} from '@/data/mock-trends-page.mock';
import { COLORS } from '@/constants/app.constants';
import { TrendListRow } from './components/trend-list-row.component';
import { useBlogs } from '@/hooks/queries/blog.queries';
import { SkeletonBox, SkeletonRow } from '@/components/ui/skeleton.component';

type Props = RootStackScreenProps<'TrendsList'>;

function TrendListRowSkeleton() {
  return (
    <SkeletonRow>
      <SkeletonBox width={88} height={88} borderRadius={12} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBox width={60} height={10} />
        <SkeletonBox width={180} height={12} />
        <SkeletonBox width={120} height={10} />
      </View>
    </SkeletonRow>
  );
}

function TrendsListSkeleton({ bottomPad }: { bottomPad: number }) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: bottomPad + 24 }}
    >
      <View className="px-4 pt-2 gap-4">
        {/* Hero banner */}
        <SkeletonBox width="100%" height={260} borderRadius={24} />

        <View style={{ gap: 16, paddingTop: 24 }}>
          {/* Section title */}
          <SkeletonBox width={160} height={20} />

          {/* Featured card */}
          <View style={{ gap: 8 }}>
            <SkeletonBox width="100%" height={220} borderRadius={16} />
            <SkeletonBox width={80} height={12} />
            <SkeletonBox width={200} height={12} />
            <SkeletonBox width={140} height={12} />
          </View>

          {/* List rows */}
          <View style={{ gap: 12 }}>
            <TrendListRowSkeleton />
            <TrendListRowSkeleton />
            <TrendListRowSkeleton />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
});

export function TrendsListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useBlogs();

  const { featured, rest } = useMemo(() => {
    const blogs = data?.data ?? [];
    const f = blogs.find((b) => b.isFeatured) ?? blogs[0];
    const r = blogs.filter((b) => b.id !== f?.id);
    return { featured: f, rest: r };
  }, [data]);

  if (isLoading) {
    return <TrendsListSkeleton bottomPad={insets.bottom} />;
  }

  const openWebTrends = () => {
    Linking.openURL(TRENDS_WEB_URL);
  };

  const goBlog = (id: string) => {
    navigation.navigate('BlogDetail', { blogId: id });
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <View className="px-4 pt-2">
        <View className="rounded-3xl overflow-hidden mb-2" style={cardShadow}>
          <ImageBackground
            source={{ uri: TRENDS_PAGE_HERO.image }}
            className="min-h-[260px] justify-end"
            resizeMode="cover"
          >
            <View className="bg-black/50 px-5 py-6">
              <Text className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">
                {TRENDS_PAGE_HERO.tagline}
              </Text>
              <Text className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                {TRENDS_PAGE_HERO.title}
              </Text>
              <Text className="text-sm text-white/90 mt-2 leading-6">{TRENDS_PAGE_HERO.description}</Text>
              <View className="flex-row flex-wrap gap-2 mt-4">
                <TouchableOpacity
                  onPress={() => navigation.navigate('Main', { screen: 'Explore' })}
                  className="flex-row items-center gap-2 bg-white rounded-full px-4 py-2.5"
                  activeOpacity={0.85}
                >
                  <Text className="text-sm font-bold text-on-surface">Shop the Trend</Text>
                  <ArrowRight size={16} color={COLORS.onSurface} strokeWidth={2.5} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => goBlog(TRENDS_PAGE_HERO.featuredBlogId)}
                  className="flex-row items-center gap-2 rounded-full border border-white/80 px-4 py-2.5"
                  activeOpacity={0.85}
                >
                  <BookOpen size={16} color="#fff" strokeWidth={2} />
                  <Text className="text-sm font-semibold text-white">Blog Editorial</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>

      <View className="px-5 pt-6">
        <View className="flex-row items-start justify-between gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-xl font-extrabold text-on-surface tracking-tight">{TRENDS_FORECAST_LABEL}</Text>
            <Text className="text-sm text-secondary mt-1 leading-5">{TRENDS_FORECAST_SUBTITLE}</Text>
          </View>
          <TouchableOpacity
            onPress={openWebTrends}
            className="flex-row items-center gap-1 shrink-0 pt-0.5"
            hitSlop={8}
          >
            <Text className="text-xs font-semibold text-primary">Xem tất cả báo cáo</Text>
            <TrendingUp size={14} color={COLORS.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {featured && (
          <TouchableOpacity
            onPress={() => goBlog(featured.id)}
            activeOpacity={0.9}
            className="bg-surface rounded-2xl overflow-hidden mb-4"
            style={cardShadow}
          >
            <Image source={{ uri: featured.image }} className="w-full h-[220px]" resizeMode="cover" />
            <View className="p-4 gap-2">
              {featured.editorialSeries ? (
                <Text className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
                  {featured.editorialSeries}
                </Text>
              ) : null}
              <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {featured.topic}
                </Text>
                <Text className="text-xs text-secondary">· {featured.readTime}</Text>
                {featured.wordCount != null ? (
                  <Text className="text-xs text-secondary">· ~{featured.wordCount} chữ</Text>
                ) : null}
              </View>
              <Text className="text-lg font-extrabold text-on-surface leading-snug">{featured.title}</Text>
              {featured.dek ? (
                <Text className="text-sm font-semibold text-on-surface/90 leading-5">{featured.dek}</Text>
              ) : null}
              <Text className="text-sm text-secondary leading-5">{featured.excerpt}</Text>
              {featured.author ? (
                <Text className="text-xs text-secondary font-medium mt-1">
                  {featured.author}
                  {featured.authorRole ? ` · ${featured.authorRole}` : ''}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}

        <View className="gap-3 mb-8">
          {rest.map((item) => (
            <TrendListRow key={item.id} item={item} onPress={() => goBlog(item.id)} />
          ))}
        </View>

        <Text className="text-xl font-extrabold text-on-surface tracking-tight">Community Spotlight</Text>
        <Text className="text-sm text-secondary mt-1 mb-4 leading-5">
          Phối đồ ấn tượng từ cộng đồng Curators của ModaMi.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3 pb-2"
        >
          {mockTrendSpotlights.map((c) => (
            <View key={c.id} className="w-[140px]">
              <Image
                source={{ uri: c.image }}
                className="w-full h-[180px] rounded-2xl bg-surface-container"
                resizeMode="cover"
              />
              <View className="flex-row items-center gap-2 mt-2">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: c.accentColor }}
                >
                  <Text className="text-[10px] font-bold text-white">{c.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-on-surface" numberOfLines={1}>
                    {c.name}
                  </Text>
                  <Text className="text-[9px] text-secondary uppercase tracking-wide" numberOfLines={1}>
                    {c.role}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Membership')}
        activeOpacity={0.9}
        className="mx-5 mt-8 rounded-2xl bg-primary px-5 py-6"
        style={Platform.select({
          ios: {
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.22,
            shadowRadius: 16,
          },
          android: { elevation: 4 },
        })}
      >
        <Text className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">
          Trải nghiệm đặc quyền
        </Text>
        <Text className="text-xl font-extrabold text-white mt-2 leading-snug">
          Trở thành ModaMi Curator ngay hôm nay.
        </Text>
        <Text className="text-sm text-white/90 mt-2">
          Nhận báo cáo xu hướng sớm và kết nối cộng đồng đồng điệu.
        </Text>
        <View className="self-start mt-4 bg-white/20 rounded-full px-4 py-2">
          <Text className="text-sm font-bold text-white">Xem gói hội viên</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
