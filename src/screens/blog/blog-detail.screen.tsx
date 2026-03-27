import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { mockTrends } from '@/data/mock-trends.mock';
import { TRENDS_WEB_URL } from '@/data/mock-trends-page.mock';
import type { TrendReadingLevel } from '@/types/app.type';

type Props = RootStackScreenProps<'BlogDetail'>;

const READING_LEVEL_LABEL: Record<TrendReadingLevel, string> = {
  light: 'Đọc nhẹ',
  medium: 'Trung bình',
  deep: 'Chuyên sâu',
};

export function BlogDetailScreen({ route }: Props) {
  const { blogId } = route.params;
  const blog = mockTrends.find((b) => b.id === blogId);

  const paragraphs = useMemo(() => {
    if (!blog?.body) return [];
    return blog.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  }, [blog?.body]);

  if (!blog) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-secondary text-center">Không tìm thấy bài viết.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-10"
    >
      <View>
        <Image source={{ uri: blog.image }} className="w-full aspect-[16/10]" resizeMode="cover" />
        {blog.coverCaption ? (
          <Text className="text-[11px] text-secondary px-5 pt-2 leading-4 italic">{blog.coverCaption}</Text>
        ) : null}
      </View>

      <View className="px-5 pt-4 gap-3">
        {blog.editorialSeries ? (
          <Text className="text-[10px] font-semibold text-primary/80 uppercase tracking-[0.15em]">
            {blog.editorialSeries}
          </Text>
        ) : null}

        <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
          <Text className="text-[11px] font-bold text-primary uppercase tracking-widest">{blog.topic}</Text>
          <Text className="text-xs text-secondary">· {blog.readTime}</Text>
          {blog.publishedAt ? (
            <Text className="text-xs text-secondary">· Xuất bản {blog.publishedAt}</Text>
          ) : null}
          {blog.updatedAt && blog.updatedAt !== blog.publishedAt ? (
            <Text className="text-xs text-secondary">· Cập nhật {blog.updatedAt}</Text>
          ) : null}
        </View>

        <Text className="text-2xl font-extrabold text-on-surface leading-snug tracking-tight">{blog.title}</Text>

        {blog.dek ? (
          <Text className="text-base text-on-surface/90 font-semibold leading-6">{blog.dek}</Text>
        ) : null}

        <Text className="text-[15px] text-secondary leading-6">{blog.excerpt}</Text>

        <View className="flex-row flex-wrap gap-2 pt-1">
          {blog.wordCount != null ? (
            <View className="bg-surface-container rounded-full px-3 py-1">
              <Text className="text-[11px] text-secondary">
                ~{blog.wordCount.toLocaleString('vi-VN')} chữ
              </Text>
            </View>
          ) : null}
          {blog.readingLevel ? (
            <View className="bg-primary/10 rounded-full px-3 py-1">
              <Text className="text-[11px] font-semibold text-primary">
                {READING_LEVEL_LABEL[blog.readingLevel]}
              </Text>
            </View>
          ) : null}
        </View>

        {(blog.author || blog.authorRole) && (
          <View className="mt-2 p-4 rounded-2xl bg-surface border border-surface-container">
            <Text className="text-xs font-bold text-on-surface uppercase tracking-wide">Tác giả</Text>
            <Text className="text-base font-bold text-primary mt-1">{blog.author ?? 'Ẩn danh'}</Text>
            {blog.authorRole ? (
              <Text className="text-sm text-secondary mt-0.5">{blog.authorRole}</Text>
            ) : null}
            {blog.authorBio ? (
              <Text className="text-sm text-secondary mt-2 leading-5">{blog.authorBio}</Text>
            ) : null}
          </View>
        )}

        {blog.keyTakeaways && blog.keyTakeaways.length > 0 ? (
          <View className="rounded-2xl bg-primary/5 border border-primary/15 p-4 gap-3">
            <Text className="text-sm font-extrabold text-primary uppercase tracking-wide">Ý chính</Text>
            {blog.keyTakeaways.map((line, i) => (
              <View key={i} className="flex-row gap-2">
                <Text className="text-primary font-bold">▸</Text>
                <Text className="flex-1 text-sm text-on-surface leading-6">{line}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="h-px bg-surface-container my-2" />

        {paragraphs.map((block, i) => (
          <Text key={i} className="text-[15px] text-on-surface leading-7 mb-1">
            {block}
          </Text>
        ))}

        {blog.sources && blog.sources.length > 0 ? (
          <View className="mt-4 pt-4 border-t border-surface-container gap-2">
            <Text className="text-xs font-bold text-secondary uppercase tracking-wide">Tham khảo</Text>
            {blog.sources.map((s, i) => (
              <Text key={i} className="text-xs text-secondary leading-5">
                · {s}
              </Text>
            ))}
          </View>
        ) : null}

        {blog.tags && blog.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 mt-4">
            {blog.tags.map((tag) => (
              <View key={tag} className="bg-surface-container rounded-full px-3 py-1">
                <Text className="text-xs text-secondary">#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <TouchableOpacity
          onPress={() => Linking.openURL(TRENDS_WEB_URL)}
          className="mt-6 self-start bg-primary/10 rounded-full px-4 py-2.5"
          activeOpacity={0.8}
        >
          <Text className="text-sm font-semibold text-primary">Xem thêm xu hướng trên ModaMi Web →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
