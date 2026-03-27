import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import type { TrendBlog } from '@/types/app.type';

interface TrendsSectionProps {
  data: TrendBlog[];
  onSeeAll: () => void;
  onItemPress: (blogId: string) => void;
}

export function TrendsSection({ data, onSeeAll, onItemPress }: TrendsSectionProps) {
  return (
    <View className="mt-8 mb-2">
      <View className="flex-row items-end justify-between px-5 mb-4">
        <View>
          <Text className="text-xs font-semibold text-primary/70 uppercase tracking-widest">
            Xu hướng trends
          </Text>
          <Text className="text-xl font-bold text-on-surface mt-1">Blog cộng đồng</Text>
        </View>
        <TouchableOpacity onPress={onSeeAll} hitSlop={8}>
          <Text className="text-xs font-semibold text-primary/70 uppercase tracking-widest">
            Xem thêm
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 gap-3"
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onItemPress(item.id)}
            className="w-[280px] bg-surface rounded-2xl overflow-hidden"
          >
            <Image source={{ uri: item.image }} className="w-full h-[140px]" resizeMode="cover" />
            <View className="p-3">
              {item.editorialSeries ? (
                <Text className="text-[9px] font-semibold text-secondary uppercase tracking-wider mb-1" numberOfLines={1}>
                  {item.editorialSeries}
                </Text>
              ) : null}
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">
                  {item.topic}
                </Text>
                <Text className="text-xs text-secondary">· {item.readTime}</Text>
              </View>
              <Text className="text-sm font-bold text-on-surface" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-xs text-secondary mt-1" numberOfLines={2}>
                {item.excerpt}
              </Text>
              {item.author ? (
                <Text className="text-[10px] text-secondary mt-2 font-medium">{item.author}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
