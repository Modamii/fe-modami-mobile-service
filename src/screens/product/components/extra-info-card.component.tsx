import React from 'react';
import { View, Text } from 'react-native';
import { cardShadow } from '../constants/product-detail.constants';

type Props = Readonly<{
  careInstructions?: string;
  shippingNotes?: string;
  authenticityNote?: string;
}>;

export function ExtraInfoCard({ careInstructions, shippingNotes, authenticityNote }: Props) {
  if (!careInstructions && !shippingNotes && !authenticityNote) return null;

  return (
    <View className="bg-surface rounded-2xl p-4 gap-4" style={cardShadow}>
      <Text className="text-sm font-bold text-on-surface uppercase tracking-wide">
        Thông tin thêm
      </Text>
      {careInstructions ? (
        <View className="gap-1">
          <Text className="text-xs font-semibold text-primary">Bảo quản & giặt</Text>
          <Text className="text-sm text-secondary leading-6">{careInstructions}</Text>
        </View>
      ) : null}
      {shippingNotes ? (
        <View className="gap-1">
          <Text className="text-xs font-semibold text-primary">Giao hàng</Text>
          <Text className="text-sm text-secondary leading-6">{shippingNotes}</Text>
        </View>
      ) : null}
      {authenticityNote ? (
        <View className="gap-1">
          <Text className="text-xs font-semibold text-primary">Nguồn gốc & chứng thực</Text>
          <Text className="text-sm text-secondary leading-6">{authenticityNote}</Text>
        </View>
      ) : null}
    </View>
  );
}
