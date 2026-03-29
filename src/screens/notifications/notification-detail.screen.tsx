import React, { useEffect } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useNotifications, useMarkNotificationRead } from '@/hooks/queries/notification.queries';
import { timeAgo } from '@/lib/utils.helper';
import { COLORS } from '@/constants/app.constants';

type Props = RootStackScreenProps<'NotificationDetail'>;

const TYPE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  system: { label: 'Hệ thống', bg: '#f0fdf4', color: COLORS.primary },
  news: { label: 'Tin tức', bg: '#eff6ff', color: '#2563eb' },
  sale: { label: 'Mua bán', bg: '#fef3c7', color: '#92400e' },
  like: { label: 'Hoạt động', bg: '#fdf4ff', color: '#7e22ce' },
  comment: { label: 'Hoạt động', bg: '#fdf4ff', color: '#7e22ce' },
  follow: { label: 'Hoạt động', bg: '#fdf4ff', color: '#7e22ce' },
};

const cardShadow = Platform.select({
  ios: { shadowColor: '#191c1c', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  android: { elevation: 2 },
});

function renderDetail(text: string) {
  // Split on blank lines to get paragraphs, handle **bold** and # headers
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, i) => {
    const isHeading1 = para.startsWith('# ');
    const isHeading2 = para.startsWith('## ');
    const isBullet = para.trim().startsWith('•') || para.trim().startsWith('*');

    if (isHeading1) {
      return (
        <Text key={i} style={{ fontSize: 18, fontWeight: '800', color: COLORS.onSurface, marginBottom: 4, marginTop: i > 0 ? 12 : 0 }}>
          {para.replace(/^# /, '')}
        </Text>
      );
    }
    if (isHeading2) {
      return (
        <Text key={i} style={{ fontSize: 15, fontWeight: '700', color: COLORS.onSurface, marginTop: 16, marginBottom: 4 }}>
          {para.replace(/^## /, '')}
        </Text>
      );
    }

    // Inline: replace **bold** with bold text segments
    const lines = para.split('\n').filter(Boolean);
    return (
      <View key={i} style={{ marginBottom: 8 }}>
        {lines.map((line, j) => {
          const bold = line.split(/\*\*(.+?)\*\*/g);
          return (
            <Text key={j} style={{ fontSize: 14, color: COLORS.secondary, lineHeight: 22 }}>
              {bold.map((part, k) =>
                k % 2 === 1
                  ? <Text key={k} style={{ fontWeight: '700', color: COLORS.onSurface }}>{part}</Text>
                  : part,
              )}
            </Text>
          );
        })}
      </View>
    );
  });
}

export function NotificationDetailScreen({ route }: Props) {
  const { notificationId } = route.params;
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();

  const notification = data?.data?.find((n) => n.id === notificationId);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markRead.mutate(notificationId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification?.isRead]);

  if (!notification) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: COLORS.secondary }}>Không tìm thấy thông báo</Text>
      </View>
    );
  }

  const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f9f9f8' }}
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header card */}
      <View style={[{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 }, cardShadow]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, backgroundColor: cfg.bg }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: cfg.color }}>{cfg.label}</Text>
          </View>
          <Text style={{ fontSize: 12, color: COLORS.secondary }}>{timeAgo(notification.createdAt)}</Text>
        </View>
        <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.onSurface, lineHeight: 24, marginBottom: 6 }}>
          {notification.title}
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.secondary, lineHeight: 20 }}>
          {notification.body}
        </Text>
      </View>

      {/* Detail content */}
      {notification.detail && (
        <View style={[{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }, cardShadow]}>
          {renderDetail(notification.detail)}
        </View>
      )}
    </ScrollView>
  );
}
