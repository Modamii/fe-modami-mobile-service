import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';
import { useCreditStore } from '@/store';
import { formatCredits } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type Props = RootStackScreenProps<'Credits'>;

export function CreditsScreen(_props: Props) {
  const balance = useCreditStore((s) => s.balance);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      {/* Balance card */}
      <View className="bg-primary rounded-2xl p-6 items-center gap-2">
        <Text className="text-white/70 text-sm uppercase tracking-widest">Số dư hiện tại</Text>
        <Text className="text-white text-5xl font-bold">{formatCredits(balance)}</Text>
        <Text className="text-white/70 text-sm">ModaMi Credits</Text>
      </View>

      {/* How it works */}
      <View className="bg-surface rounded-2xl p-5 gap-3"
        style={{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}>
        <Text className="text-base font-bold text-on-surface">Credits hoạt động như thế nào?</Text>
        {[
          { emoji: '🛍️', text: 'Dùng credits để xem thông tin liên hệ người bán' },
          { emoji: '💚', text: 'Nhận credits khi bán hàng thành công' },
          { emoji: '👑', text: 'Thành viên Style & Elite nhận bonus credits hàng tháng' },
        ].map((item, i) => (
          <View key={i} className="flex-row items-start gap-3">
            <Text className="text-lg">{item.emoji}</Text>
            <Text className="flex-1 text-sm text-secondary leading-relaxed">{item.text}</Text>
          </View>
        ))}
      </View>

      <Button variant="secondary">Mua thêm Credits (sắp ra mắt)</Button>
    </ScrollView>
  );
}
