import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  type ListRenderItemInfo,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';
import { COLORS } from '@/constants/app.constants';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i);

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

// ─── PickerColumn ──────────────────────────────────────────────────────────

interface PickerColumnProps {
  data: (string | number)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  flex: number;
}

function PickerColumn({ data, selectedIndex, onSelect, flex }: PickerColumnProps) {
  const listRef = useRef<FlatList>(null);
  const paddedData = useMemo(
    () => [null, null, ...data, null, null],
    [data],
  );

  // Khi snapped: scrollOffset y = realIndex × ITEM_HEIGHT
  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const realIndex = Math.round(y / ITEM_HEIGHT);
      if (realIndex >= 0 && realIndex < data.length) {
        onSelect(realIndex);
      }
    },
    [data.length, onSelect],
  );

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < data.length) {
      // y = realIndex × ITEM_HEIGHT (xem giải thích trong handleScrollEnd)
      listRef.current?.scrollToOffset({
        offset: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex, height: PICKER_HEIGHT, overflow: 'hidden' }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 4,
          right: 4,
          height: ITEM_HEIGHT,
          backgroundColor: COLORS.primary + '14',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: COLORS.primary + '40',
          borderRadius: 8,
          zIndex: 1,
        }}
      />
      <FlatList
        ref={listRef}
        data={paddedData}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        renderItem={({ item, index }: ListRenderItemInfo<string | number | null>) => {
          const realIndex = index - 2;
          const isSelected = realIndex === selectedIndex;
          return (
            <View style={{ height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
              {item !== null && (
                <Text
                  style={{
                    fontSize: isSelected ? 17 : 15,
                    fontWeight: isSelected ? '700' : '400',
                    color: isSelected ? COLORS.primary : COLORS.secondary,
                    opacity: Math.abs(realIndex - selectedIndex) > 1 ? 0.45 : 1,
                  }}
                >
                  {item}
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

// ─── DatePickerInput ────────────────────────────────────────────────────────

interface DatePickerInputProps {
  label?: string;
  value?: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
}

export function DatePickerInput({
  label,
  value,
  onChange,
  error,
  placeholder = 'Chọn ngày sinh',
}: DatePickerInputProps) {
  const sheetRef = useRef<BottomSheetModal>(null);

  const parseValue = useCallback((v?: string) => {
    if (!v) return { day: 0, month: 0, year: 0 };
    const parts = v.split('-');
    if (parts.length !== 3) return { day: 0, month: 0, year: 0 };
    return {
      day: parseInt(parts[2], 10) - 1,
      month: parseInt(parts[1], 10) - 1,
      year: YEARS.indexOf(parseInt(parts[0], 10)),
    };
  }, []);

  const initial = parseValue(value);
  const [dayIndex, setDayIndex] = useState(initial.day >= 0 ? initial.day : 0);
  const [monthIndex, setMonthIndex] = useState(initial.month >= 0 ? initial.month : 0);
  const [yearIndex, setYearIndex] = useState(initial.year >= 0 ? initial.year : 0);

  const days = useMemo(() => {
    const count = daysInMonth(monthIndex + 1, YEARS[yearIndex]);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [monthIndex, yearIndex]);

  useEffect(() => {
    if (dayIndex >= days.length) setDayIndex(days.length - 1);
  }, [days, dayIndex]);

  function formatDisplay(v?: string): string {
    if (!v) return '';
    const parts = v.split('-');
    if (parts.length !== 3) return v;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function handleConfirm() {
    const y = YEARS[yearIndex];
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(days[dayIndex]).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    sheetRef.current?.dismiss();
  }

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

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-sm font-medium text-on-surface/70">{label}</Text>
      )}

      <TouchableOpacity
        onPress={() => sheetRef.current?.present()}
        activeOpacity={0.75}
        className="h-[50px] bg-surface-container rounded-xl px-4 flex-row items-center border"
        style={{ borderColor: error ? '#f87171' : '#e0e0de' }}
      >
        <Text
          className="flex-1 text-[15px]"
          style={{ color: value ? COLORS.onSurface : COLORS.secondary }}
        >
          {value ? formatDisplay(value) : placeholder}
        </Text>
        <CalendarDaysIcon size={18} color={COLORS.secondary} />
      </TouchableOpacity>

      {error && (
        <Text className="text-xs text-red-500">{error}</Text>
      )}

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: COLORS.secondary, width: 36, opacity: 0.4 }}
        backgroundStyle={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            },
            android: { elevation: 8 },
          }),
        }}
      >
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.onSurface }}>
              Chọn ngày sinh
            </Text>
            <TouchableOpacity onPress={() => sheetRef.current?.dismiss()} hitSlop={8}>
              <Text style={{ fontSize: 14, color: COLORS.secondary }}>Huỷ</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 12, color: COLORS.secondary, fontWeight: '600', marginBottom: 4 }}>
              Ngày
            </Text>
            <Text style={{ flex: 2, textAlign: 'center', fontSize: 12, color: COLORS.secondary, fontWeight: '600', marginBottom: 4 }}>
              Tháng
            </Text>
            <Text style={{ flex: 1.5, textAlign: 'center', fontSize: 12, color: COLORS.secondary, fontWeight: '600', marginBottom: 4 }}>
              Năm
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <PickerColumn data={days} selectedIndex={dayIndex} onSelect={setDayIndex} flex={1} />
            <PickerColumn data={MONTHS} selectedIndex={monthIndex} onSelect={setMonthIndex} flex={2} />
            <PickerColumn data={YEARS} selectedIndex={yearIndex} onSelect={setYearIndex} flex={1.5} />
          </View>

          <TouchableOpacity
            onPress={handleConfirm}
            style={{
              marginTop: 20,
              height: 50,
              borderRadius: 25,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
              Xác nhận
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
