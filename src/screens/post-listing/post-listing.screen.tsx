import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CheckCircle2 } from 'lucide-react-native';
import type { MainTabScreenProps } from '@/navigation/navigation.type';
import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';
import { CATEGORIES, CONDITIONS, COLORS } from '@/constants/app.constants';

type Props = MainTabScreenProps<'PostListing'>;

const CONDITION_LABELS: Record<string, string> = {
  'new': 'Mới — chưa dùng, còn tag',
  'like-new': 'Như mới — dùng 1-2 lần',
  'good': 'Tốt — dùng vài lần, không lỗi',
  'fair': 'Khá tốt — có dấu hiệu dùng nhỏ',
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Khác'];

function SectionTitle({ children }: Readonly<{ children: string }>) {
  return <Text className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">{children}</Text>;
}


function ChipPicker({
  options,
  selected,
  onSelect,
  labelMap,
}: Readonly<{
  options: readonly string[];
  selected: string | null;
  onSelect: (v: string) => void;
  labelMap?: Record<string, string>;
}>) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            className={`rounded-full px-4 py-2 ${isSelected ? 'bg-primary' : 'bg-surface'}`}
            style={isSelected ? undefined : { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
          >
            <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-secondary'}`}>
              {labelMap ? labelMap[opt] ?? opt : opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function PostListingScreen(_props: Props) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);

  const canSubmit = title.trim() && price.trim() && category && condition;

  const handleSubmit = () => {
    Alert.alert('Đã đăng bán!', 'Sản phẩm của bạn đang chờ kiểm duyệt.', [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-5 pt-4 pb-2">
            <Text className="text-2xl font-black text-on-surface tracking-tight">Đăng bán</Text>
            <Text className="text-sm text-secondary mt-0.5">Chia sẻ món đồ của bạn với cộng đồng</Text>
          </View>

          {/* ── Photos ── */}
          <View className="px-5 pt-4 pb-2">
            <SectionTitle>Ảnh sản phẩm</SectionTitle>
            <View className="flex-row flex-wrap gap-3">
              {/* Main upload slot */}
              <TouchableOpacity
                className="w-[110px] h-[110px] bg-surface rounded-2xl items-center justify-center gap-2"
                style={{ shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1, borderWidth: 1.5, borderColor: COLORS.outlineVariant, borderStyle: 'dashed' }}
              >
                <Camera size={24} color={COLORS.secondary} strokeWidth={1.5} />
                <Text className="text-xs text-secondary font-medium">Thêm ảnh</Text>
              </TouchableOpacity>

              {/* Empty slots */}
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  className="w-[110px] h-[110px] bg-surface-low rounded-2xl items-center justify-center"
                  style={{ borderWidth: 1, borderColor: COLORS.outlineVariant, borderStyle: 'dashed' }}
                >
                  <Text className="text-[11px] text-secondary/50">{i + 2}/6</Text>
                </View>
              ))}
            </View>
            <Text className="text-xs text-secondary mt-2">Ảnh đầu tiên là ảnh bìa · Tối đa 6 ảnh</Text>
          </View>

          {/* ── Basic info ── */}
          <View className="px-5 pt-4 gap-3">
            <SectionTitle>Thông tin cơ bản</SectionTitle>
            <Input
              label="Tên sản phẩm *"
              value={title}
              onChangeText={setTitle}
              placeholder="VD: Áo blazer vintage xanh navy"
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="Giá bán (₫) *"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="350.000"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Thương hiệu"
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="Zara, H&M..."
                />
              </View>
            </View>
          </View>

          {/* ── Category ── */}
          <View className="px-5 pt-4">
            <SectionTitle>Danh mục *</SectionTitle>
            <ChipPicker
              options={CATEGORIES}
              selected={category}
              onSelect={setCategory}
            />
          </View>

          {/* ── Condition ── */}
          <View className="px-5 pt-4">
            <SectionTitle>Tình trạng *</SectionTitle>
            <View className="gap-2">
              {CONDITIONS.map((cond) => {
                const isSelected = condition === cond;
                return (
                  <TouchableOpacity
                    key={cond}
                    onPress={() => setCondition(cond)}
                    className={`flex-row items-center gap-3 rounded-xl px-4 py-3 ${isSelected ? 'bg-primary/10' : 'bg-surface'}`}
                    style={isSelected ? undefined : { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
                  >
                    <CheckCircle2
                      size={20}
                      color={isSelected ? COLORS.primary : COLORS.outlineVariant}
                      fill={isSelected ? COLORS.primary : 'none'}
                      strokeWidth={2}
                    />
                    <View className="flex-1">
                      <Text className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                        {cond === 'new' ? 'Mới' : cond === 'like-new' ? 'Như mới' : cond === 'good' ? 'Tốt' : 'Khá tốt'}
                      </Text>
                      <Text className="text-xs text-secondary mt-0.5">{CONDITION_LABELS[cond]}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Size ── */}
          <View className="px-5 pt-4">
            <SectionTitle>Kích cỡ</SectionTitle>
            <ChipPicker options={SIZES} selected={size} onSelect={setSize} />
          </View>

          {/* ── Description ── */}
          <View className="px-5 pt-4 pb-4">
            <SectionTitle>Mô tả thêm</SectionTitle>
            <Input
              label=""
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả chi tiết: xuất xứ, lý do bán, ghi chú kích thước thực tế..."
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
            />
          </View>

          {/* Submit */}
          <View className="px-5 pb-8">
            <Button onPress={handleSubmit} disabled={!canSubmit}>
              Đăng bán ngay
            </Button>
            {!canSubmit && (
              <Text className="text-xs text-secondary text-center mt-2">
                Vui lòng điền tên, giá, danh mục và tình trạng
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
