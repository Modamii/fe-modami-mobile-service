import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useAppStore } from '@/store/app.store';
import { COLORS } from '@/constants/app.constants';
import { SLIDES, ctaShadow, type Slide, type SlideId } from './constants/onboarding.constants';
import { DiscoverIllustration } from './components/discover-illustration.component';
import { TrustIllustration } from './components/trust-illustration.component';
import { CreditIllustration } from './components/credit-illustration.component';
import { ImpactIllustration } from './components/impact-illustration.component';
import { AnimatedDot } from './components/animated-dot.component';

type Props = RootStackScreenProps<'Onboarding'>;

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
