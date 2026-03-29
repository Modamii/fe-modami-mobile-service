import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/solid';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useAuthStore, useMembershipStore } from '@/store/app.store';
import { COLORS } from '@/constants/app.constants';
import type { MembershipBillingCycle } from '@/types/app.type';
import { MEMBERSHIP_PLANS } from './constants/membership.constants';

type Props = RootStackScreenProps<'Membership'>;

const BILLING_CYCLES: MembershipBillingCycle[] = ['monthly', 'yearly'];

export function MembershipScreen(_props: Props) {
  const user = useAuthStore((s) => s.user);
  const { tier, subscribe } = useMembershipStore();
  const [billing, setBilling] = React.useState<MembershipBillingCycle>('monthly');

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <Text className="text-sm text-secondary text-center">
        Hiện tại: <Text className="font-semibold text-primary capitalize">{tier}</Text>
      </Text>

      {/* Billing toggle */}
      <View className="flex-row bg-surface-container rounded-xl p-1">
        {BILLING_CYCLES.map((cycle) => (
          <TouchableOpacity
            key={cycle}
            onPress={() => setBilling(cycle)}
            className={`flex-1 py-2 rounded-lg items-center ${billing === cycle ? 'bg-surface' : ''}`}
          >
            <Text className={`text-sm font-medium ${billing === cycle ? 'text-primary' : 'text-secondary'}`}>
              {cycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
            </Text>
            {cycle === 'yearly' && (
              <Text className="text-xs text-primary font-semibold">Tiết kiệm 17%</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Plan cards */}
      {MEMBERSHIP_PLANS.map((plan) => {
        const isActive = tier === plan.id;
        return (
          <View
            key={plan.id}
            className={`bg-surface rounded-2xl p-5 gap-4 ${isActive ? 'border-2 border-primary' : ''}`}
            style={{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-on-surface">{plan.label}</Text>
              {isActive && (
                <View className="bg-primary rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-semibold">Hiện tại</Text>
                </View>
              )}
            </View>
            <View>
              <Text className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(plan.price[billing])}
              </Text>
              <Text className="text-sm text-secondary">/{billing === 'monthly' ? 'tháng' : 'năm'}</Text>
            </View>
            <View className="gap-2">
              {plan.perks.map((perk) => (
                <View key={perk} className="flex-row items-center gap-2">
                  <CheckIcon size={16} color={COLORS.primary} />
                  <Text className="text-sm text-secondary">{perk}</Text>
                </View>
              ))}
            </View>
            {!isActive && (
              <TouchableOpacity
                onPress={() => subscribe(plan.id, billing)}
                className="bg-primary rounded-xl py-3 items-center"
              >
                <Text className="text-white font-semibold">Đăng ký {plan.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
