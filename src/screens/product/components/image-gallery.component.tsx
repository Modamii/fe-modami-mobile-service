import React, { RefObject } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldCheck } from 'lucide-react-native';
import { COLORS } from '@/constants/app.constants';
import {
  CONDITION_LABEL,
  IMAGE_HEIGHT,
  THUMB_SIZE,
} from '../constants/product-detail.constants';

type Props = Readonly<{
  images: string[];
  imageIndex: number;
  screenWidth: number;
  galleryRef: RefObject<ScrollView | null>;
  onIndexChange: (idx: number) => void;
  onThumbPress: (idx: number) => void;
  isVerified: boolean;
  condition: string;
}>;

export function ImageGallery({
  images,
  imageIndex,
  screenWidth,
  galleryRef,
  onIndexChange,
  onThumbPress,
  isVerified,
  condition,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="relative bg-surface-container"
      style={{ height: IMAGE_HEIGHT }}
    >
      <ScrollView
        ref={galleryRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width,
          );
          onIndexChange(idx);
        }}
        style={{ height: IMAGE_HEIGHT }}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            style={{ width: screenWidth, height: IMAGE_HEIGHT }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View
        className="absolute left-4 flex-row flex-wrap gap-2 z-[1]"
        style={{ top: insets.top + 55 }}
        pointerEvents="box-none"
      >
        <View className="bg-on-surface/75 px-3.5 py-1.5 rounded-full">
          <Text className="text-white text-sm font-bold tracking-wide">
            {CONDITION_LABEL[condition]?.toUpperCase() ?? condition}
          </Text>
        </View>
        {isVerified && (
          <View className="flex-row items-center gap-1 bg-primary/90 px-3 py-1.5 rounded-full">
            <ShieldCheck size={13} color="#fff" strokeWidth={2.5} />
            <Text className="text-white text-sm font-semibold">
              Đã xác thực
            </Text>
          </View>
        )}
      </View>

      {images.length > 1 && (
        <View
          className="absolute bottom-[72px] left-0 right-0 flex-row justify-center gap-1.5 z-[1]"
          pointerEvents="none"
        >
          {images.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                i === imageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </View>
      )}

      <View className="absolute bottom-0 left-0 right-0 bg-black/25 px-3 py-2 z-[1]">
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-2"
        >
          {images.map((uri, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onThumbPress(i)}
              className={`overflow-hidden`}
            >
              <Image
                source={{ uri }}
                style={{
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: i === imageIndex ? 'white' : 'transparent',
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
