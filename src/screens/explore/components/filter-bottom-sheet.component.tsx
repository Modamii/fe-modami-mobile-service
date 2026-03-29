import React, { forwardRef, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';
import type { ProductCondition } from '@/types/app.type';
import type { ExploreFilters } from '../hooks/useExploreScreen';

const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: 'new', label: 'Mới' },
  { value: 'like-new', label: 'Như mới' },
  { value: 'good', label: 'Còn tốt' },
  { value: 'fair', label: 'Đã dùng' },
];

const PRICE_PRESETS = [
  { label: 'Dưới 200k', min: null, max: 200000 },
  { label: '200k – 500k', min: 200000, max: 500000 },
  { label: '500k – 1tr', min: 500000, max: 1000000 },
  { label: 'Trên 1tr', min: 1000000, max: null },
];

interface FilterBottomSheetProps {
  filters: ExploreFilters;
  onApply: (filters: ExploreFilters) => void;
  onClose: () => void;
}

export const FilterBottomSheet = forwardRef<BottomSheet, FilterBottomSheetProps>(
  ({ filters, onApply, onClose }, ref) => {
    const [draft, setDraft] = useState<ExploreFilters>(filters);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (index === -1) {
          // Reset draft to current filters when dismissed without applying
          setDraft(filters);
        }
      },
      [filters],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
        />
      ),
      [],
    );

    function toggleCondition(condition: ProductCondition) {
      setDraft((prev) => {
        const exists = prev.conditions.includes(condition);
        return {
          ...prev,
          conditions: exists
            ? prev.conditions.filter((c) => c !== condition)
            : [...prev.conditions, condition],
        };
      });
    }

    function applyPreset(min: number | null, max: number | null) {
      const alreadyActive = draft.priceMin === min && draft.priceMax === max;
      setDraft((prev) => ({
        ...prev,
        priceMin: alreadyActive ? null : min,
        priceMax: alreadyActive ? null : max,
      }));
    }

    function handleApply() {
      onApply(draft);
      onClose();
    }

    function handleReset() {
      const empty: ExploreFilters = { conditions: [], priceMin: null, priceMax: null };
      setDraft(empty);
      onApply(empty);
      onClose();
    }

    const activeCount =
      draft.conditions.length +
      (draft.priceMin !== null || draft.priceMax !== null ? 1 : 0);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={handleSheetChange}
        handleIndicatorStyle={{ backgroundColor: COLORS.secondary, width: 36, opacity: 0.4 }}
        backgroundStyle={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16 },
            android: { elevation: 8 },
          }),
        }}
      >
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.onSurface }}>Bộ lọc</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <XMarkIcon size={20} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>

          {/* Condition */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.onSurface, marginTop: 8, marginBottom: 10 }}>
            Tình trạng
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CONDITIONS.map((c) => {
              const active = draft.conditions.includes(c.value);
              return (
                <TouchableOpacity
                  key={c.value}
                  onPress={() => toggleCondition(c.value)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: active ? COLORS.primary : '#f5f5f4',
                    borderWidth: active ? 0 : 1,
                    borderColor: '#e0e0de',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '500', color: active ? '#fff' : COLORS.secondary }}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Price presets */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.onSurface, marginTop: 20, marginBottom: 10 }}>
            Khoảng giá
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {PRICE_PRESETS.map((preset) => {
              const active = draft.priceMin === preset.min && draft.priceMax === preset.max;
              return (
                <TouchableOpacity
                  key={preset.label}
                  onPress={() => applyPreset(preset.min, preset.max)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: active ? COLORS.primary : '#f5f5f4',
                    borderWidth: active ? 0 : 1,
                    borderColor: '#e0e0de',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '500', color: active ? '#fff' : COLORS.secondary }}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom price range */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, alignItems: 'center' }}>
            <TextInput
              placeholder="Từ"
              placeholderTextColor={COLORS.secondary}
              keyboardType="numeric"
              value={draft.priceMin !== null ? String(draft.priceMin) : ''}
              onChangeText={(t) =>
                setDraft((prev) => ({ ...prev, priceMin: t ? parseInt(t, 10) : null }))
              }
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e0e0de',
                paddingHorizontal: 12,
                fontSize: 14,
                color: COLORS.onSurface,
                backgroundColor: '#fafafa',
              }}
            />
            <View style={{ width: 12, height: 1, backgroundColor: '#ccc' }} />
            <TextInput
              placeholder="Đến"
              placeholderTextColor={COLORS.secondary}
              keyboardType="numeric"
              value={draft.priceMax !== null ? String(draft.priceMax) : ''}
              onChangeText={(t) =>
                setDraft((prev) => ({ ...prev, priceMax: t ? parseInt(t, 10) : null }))
              }
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e0e0de',
                paddingHorizontal: 12,
                fontSize: 14,
                color: COLORS.onSurface,
                backgroundColor: '#fafafa',
              }}
            />
          </View>

          {/* Footer buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              onPress={handleReset}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary }}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              style={{
                flex: 2,
                height: 48,
                borderRadius: 24,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
                {activeCount > 0 ? `Áp dụng (${activeCount})` : 'Áp dụng'}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);
