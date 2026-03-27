import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackScreenProps } from '@/navigation/navigation.type';
import { useAuthStore } from '@/store/app.store';
import { Input } from '@/components/ui/input.component';
import { Button } from '@/components/ui/button.component';

type Props = RootStackScreenProps<'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [nameError, setNameError] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      setName(user.name);
      setBio(user.bio ?? '');
      setLocation(user.location ?? '');
      setAvatarUrl(user.avatar ?? '');
      setNameError('');
    }, [user]),
  );

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Vui lòng nhập tên hiển thị');
      return;
    }
    setNameError('');
    updateProfile({
      name: trimmedName,
      bio: bio.trim() || undefined,
      location: location.trim() || undefined,
      avatar: avatarUrl.trim() || undefined,
    });
    Alert.alert('Đã lưu', 'Hồ sơ của bạn đã được cập nhật.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (!user) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-5 pb-10 pt-2"
      >
        <Text className="text-sm text-secondary mb-4 leading-5">
          Thông tin hiển thị trên cửa hàng và khi bạn mua bán với cộng đồng ModaMi.
        </Text>

        <View className="gap-4">
          <Input
            label="Tên hiển thị *"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (nameError) setNameError('');
            }}
            placeholder="VD: Minh Curator"
            error={nameError}
            autoCapitalize="words"
          />

          <View className="gap-1">
            <Text className="text-sm font-medium text-on-surface/70">Email</Text>
            <View className="bg-surface-container/80 rounded-xl px-4 py-3 border border-transparent">
              <Text className="text-base text-secondary">{user.email}</Text>
            </View>
            <Text className="text-xs text-secondary">
              Email dùng đăng nhập — liên hệ hỗ trợ nếu cần đổi.
            </Text>
          </View>

          <Input
            label="Địa điểm"
            value={location}
            onChangeText={setLocation}
            placeholder="VD: Quận 1, TP. Hồ Chí Minh"
          />

          <Input
            label="Giới thiệu ngắn"
            value={bio}
            onChangeText={setBio}
            placeholder="Chia sẻ phong cách, niche bạn tuyển chọn đồ…"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />

          <Input
            label="Ảnh đại diện (URL)"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            placeholder="https://…"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>

        <View className="mt-8 gap-3">
          <Button onPress={handleSave}>Lưu thay đổi</Button>
          <Button variant="secondary" onPress={() => navigation.goBack()}>
            Huỷ
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
