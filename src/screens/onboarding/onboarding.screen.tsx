import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheckIcon,
  QrCodeIcon,
  SparklesIcon,
  CheckBadgeIcon,
  IdentificationIcon,
  MapPinIcon,
} from 'react-native-heroicons/outline';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useAppStore } from '@/store/app.store';
import { COLORS } from '@/constants/app.constants';

type Props = RootStackScreenProps<'Onboarding'>;

// ─── Slide data ─────────────────────────────────────────────────────────────

type SlideId = 'discover' | 'trust' | 'credit' | 'impact';

interface Slide {
  id: SlideId;
  title: string;
  body: string;
  ctaLabel: string;
  ctaArrow?: boolean;
}

const SLIDES: Slide[] = [
  {
    id: 'discover',
    title: 'Khám phá Kho Báu',
    body: 'Thế giới đồ hiệu và vintage tuyển chọn, mở ra phong cách riêng cho bạn.',
    ctaLabel: 'Tiếp tục',
  },
  {
    id: 'trust',
    title: 'Giao dịch Tin Cậy',
    body: 'Hệ thống eKYC hiện đại cùng huy hiệu Người bán uy tín giúp bạn an tâm mua sắm.',
    ctaLabel: 'Tiếp tục',
  },
  {
    id: 'credit',
    title: 'M-Credit Tiện Lợi',
    body: '1 Credit',
    ctaLabel: 'Tiếp tục',
    ctaArrow: true,
  },
  {
    id: 'impact',
    title: 'Lan Tỏa Tác Động',
    body: 'Mỗi món đồ trao đổi là một hành động bảo vệ môi trường. Cùng ModaMi xây dựng cộng đồng bền vững.',
    ctaLabel: 'Bắt đầu ngay',
  },
];

// ─── Shadow helpers (platform-specific, cannot be Tailwind) ─────────────────

const cardShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24 },
  android: { elevation: 4 },
});
const badgeShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  android: { elevation: 2 },
});
const formShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  android: { elevation: 1 },
});
const creditCardShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24 },
  android: { elevation: 8 },
});
const ctaShadow = Platform.select({
  ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16 },
  android: { elevation: 4 },
});

// ─── Illustrations ───────────────────────────────────────────────────────────

function DiscoverIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
  return (
    <View className="items-center justify-center px-6 overflow-visible" style={{ height: illustrationH }}>
      <View className="w-full flex-1 relative">
        {/* Tonal offset layer */}
        <View
          className="absolute bg-surface-low rounded-2xl"
          style={{ top: -10, right: -10, width: '100%', height: '100%' }}
        />
        {/* Main image card */}
        <View className="w-full h-full rounded-2xl overflow-hidden bg-surface-container" style={cardShadow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80' }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
        </View>
        {/* Floating badge */}
        <View
          className="absolute bg-background/90 px-4 py-2.5 rounded-[10px]"
          style={{ bottom: 20, left: -12, ...badgeShadow }}
        >
          <Text className="text-[9px] font-semibold text-primary uppercase tracking-widest mb-[3px]">
            CURATION VOL. 01
          </Text>
          <Text className="text-[13px] font-extrabold text-on-surface">Tuyển chọn bởi ModaMi</Text>
        </View>
      </View>
    </View>
  );
}

function TrustIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
  return (
    <View className="items-center justify-center px-6 overflow-visible" style={{ height: illustrationH }}>
      <View className="items-center gap-5">
        {/* Shield circle */}
        <View className="relative items-center justify-center">
          <View className="w-[140px] h-[140px] rounded-full bg-primary items-center justify-center">
            <ShieldCheckIcon size={72} color="#ffffff" />
          </View>
          {/* QR badge */}
          <View className="absolute -bottom-1 -right-1 w-10 h-10 rounded-[10px] bg-surface items-center justify-center border-2 border-surface-container">
            <QrCodeIcon size={18} color={COLORS.primary} />
          </View>
        </View>

        {/* eKYC form fields */}
        <View className="gap-2.5 w-[240px]">
          <View className="flex-row items-center gap-2.5 bg-surface rounded-[10px] px-3.5 py-3" style={formShadow}>
            <IdentificationIcon size={18} color={COLORS.secondary} />
            <View className="flex-1 h-2 rounded bg-surface-container" />
            <CheckBadgeIcon size={18} color={COLORS.primary} />
          </View>
          <View className="flex-row items-center gap-2.5 bg-surface rounded-[10px] px-3.5 py-3" style={formShadow}>
            <MapPinIcon size={18} color={COLORS.secondary} />
            <View className="w-[60%] h-2 rounded bg-surface-container" />
            <CheckBadgeIcon size={18} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </View>
  );
}

function CreditIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
  return (
    <View className="items-center justify-center px-6" style={{ height: illustrationH }}>
      {/* Background circle */}
      <View className="absolute w-[220px] h-[220px] rounded-full bg-surface-container" />

      {/* Dark M-Credit card */}
      <View
        className="w-[220px] h-[130px] rounded-2xl bg-[#1a2e3d] p-4 justify-between overflow-hidden"
        style={creditCardShadow}
      >
        {/* Glow orb */}
        <View
          className="absolute w-[140px] h-[140px] rounded-full bg-[rgba(63,103,79,0.35)]"
          style={{ top: -30, right: -30 }}
        />
        <Text className="text-base font-bold text-white/90">M-Credit</Text>

        {/* Balance chip */}
        <View className="bg-white/95 rounded-[10px] px-3 py-2 self-start">
          <Text className="text-[8px] font-semibold text-secondary uppercase tracking-widest mb-[3px]">SỐ DƯ</Text>
          <View className="flex-row items-center gap-1.5">
            <SparklesIcon size={16} color={COLORS.primary} />
            <Text className="text-[13px] font-bold text-on-surface">50 M-Credit</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ImpactIllustration({ illustrationH }: Readonly<{ illustrationH: number }>) {
  return (
    <View className="items-center justify-center px-6 overflow-visible" style={{ height: illustrationH }}>
      <View className="w-full flex-1 relative">
        {/* Tonal offset layer */}
        <View
          className="absolute bg-surface-low rounded-2xl"
          style={{ top: -10, right: -10, width: '100%', height: '100%' }}
        />
        {/* Main image card */}
        <View className="w-full h-full rounded-2xl overflow-hidden bg-surface-container" style={cardShadow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
        </View>
        {/* Floating badge — right side */}
        <View
          className="absolute flex-row items-center gap-1.5 bg-background/90 px-4 py-2.5 rounded-[10px]"
          style={{ bottom: 20, right: -12, ...badgeShadow }}
        >
          <SparklesIcon size={14} color={COLORS.primary} />
          <Text className="text-[9px] font-semibold text-primary uppercase tracking-widest">SỐNG XANH CÙNG MI</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Animated dot ────────────────────────────────────────────────────────────

function AnimatedDot({ active }: Readonly<{ active: boolean }>) {
  const dotWidth = useSharedValue(active ? 24 : 8);

  React.useEffect(() => {
    dotWidth.value = withSpring(active ? 24 : 8, { damping: 14, stiffness: 120 });
  }, [active, dotWidth]);

  const animStyle = useAnimatedStyle(() => ({ width: dotWidth.value }));

  return (
    <Animated.View
      className={`h-2 rounded-full ${active ? 'bg-primary' : 'bg-surface-highest'}`}
      style={animStyle}
    />
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function OnboardingScreen(_: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const markOnboardingDone = useAppStore((s) => s.markOnboardingDone);

  const HEADER_H = 56 + insets.top;
  const DOTS_H = 48 + insets.bottom;
  const CONTENT_H = 220;
  const illustrationH = height - HEADER_H - DOTS_H - CONTENT_H;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      markOnboardingDone();
    }
  };

  const skip = () => markOnboardingDone();

  const renderIllustration = (id: SlideId) => {
    switch (id) {
      case 'discover': return <DiscoverIllustration illustrationH={illustrationH} />;
      case 'trust':    return <TrustIllustration illustrationH={illustrationH} />;
      case 'credit':   return <CreditIllustration illustrationH={illustrationH} />;
      case 'impact':   return <ImpactIllustration illustrationH={illustrationH} />;
    }
  };

  const renderBody = (slide: Slide) => {
    if (slide.id === 'credit') {
      return (
        <Text className="text-base text-secondary leading-6">
          {'Mở khóa liên hệ người bán chỉ với '}
          <Text className="text-base font-bold text-on-surface">1 Credit</Text>
          {'. Nạp nhanh, dùng gọn, chốt đơn ngay.'}
        </Text>
      );
    }
    return <Text className="text-base text-secondary leading-6">{slide.body}</Text>;
  };

  return (
    <View className="flex-1 bg-surface">
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* ── Fixed Header ── */}
      <View
        className="flex-row items-end px-5 pb-3 bg-surface z-10"
        style={{ paddingTop: insets.top, height: HEADER_H }}
      >
        <TouchableOpacity onPress={skip} hitSlop={12} className="flex-1">
          <Text className="text-lg text-secondary">✕</Text>
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-primary text-center">ModaMi</Text>
        <TouchableOpacity onPress={skip} hitSlop={12} className="flex-1 items-end">
          <Text className="text-base font-bold text-secondary">Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      {/* ── Slides ── */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        bounces={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        renderItem={({ item, index }) => (
          <View style={{ width }}>
            {renderIllustration(item.id)}

            {/* Content — fade+slide in when slide becomes visible */}
            <Animated.View
              key={`content-${index}`}
              entering={FadeInDown.duration(350).delay(80)}
              className="px-8 pt-7 gap-2.5"
            >
              <Text className="text-[34px] font-black text-on-surface leading-10">{item.title}</Text>
              {renderBody(item)}

              <TouchableOpacity
                onPress={goNext}
                activeOpacity={0.88}
                className="mt-3 bg-primary rounded-[14px] py-[18px] items-center justify-center"
                style={ctaShadow}
              >
                <Text className="text-[17px] font-bold text-white">
                  {item.ctaLabel}{item.ctaArrow ? '  →' : ''}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      />

      {/* ── Progress dots ── */}
      <View
        className="flex-row items-center justify-center gap-2 pt-2"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {SLIDES.map((slide, i) => (
          <AnimatedDot key={slide.id} active={i === currentIndex} />
        ))}
      </View>
    </View>
  );
}
