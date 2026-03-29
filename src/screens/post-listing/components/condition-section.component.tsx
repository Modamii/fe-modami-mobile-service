import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { CONDITIONS, COLORS } from '@/constants/app.constants';
import type { PostListingFormValues } from '../hooks/usePostListingScreen';
import { CONDITION_LABELS, CONDITION_NAMES } from '../post-listing.constants';
import { SectionTitle } from './section-title.component';

type Props = Readonly<{
  control: Control<PostListingFormValues>;
  errors: FieldErrors<PostListingFormValues>;
}>;

export function ConditionSection({ control, errors }: Props) {
  return (
    <View className="px-5 pt-4">
      <SectionTitle>Tình trạng *</SectionTitle>
      <Controller
        control={control}
        name="condition"
        render={({ field: { onChange, value } }) => (
          <View className="gap-2">
            {CONDITIONS.map((cond) => {
              const isSelected = value === cond;
              return (
                <TouchableOpacity
                  key={cond}
                  onPress={() => onChange(cond)}
                  className={`flex-row items-center gap-3 rounded-xl px-4 py-3 ${isSelected ? 'bg-primary/10' : 'bg-surface'}`}
                  style={
                    isSelected
                      ? undefined
                      : {
                          shadowColor: COLORS.onSurface,
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.04,
                          shadowRadius: 4,
                          elevation: 1,
                        }
                  }
                >
                  <CheckCircleIcon
                    size={20}
                    color={isSelected ? COLORS.primary : COLORS.outlineVariant}
                  />
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-on-surface'}`}
                    >
                      {CONDITION_NAMES[cond] ?? cond}
                    </Text>
                    <Text className="text-xs text-secondary mt-0.5">
                      {CONDITION_LABELS[cond]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {errors.condition && (
              <Text className="text-xs text-red-500">{errors.condition.message}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
