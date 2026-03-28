import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/app.store';
import type { RootStackParamList } from '@/navigation/navigation.type';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * Returns a `requireAuth` function. If the user is authenticated it runs the
 * given action immediately; otherwise it navigates to the AuthPrompt modal.
 *
 * Usage:
 *   const requireAuth = useRequireAuth();
 *   requireAuth(() => navigation.navigate('PostListing'), 'Đăng nhập để đăng tin.');
 */
export function useRequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigation = useNavigation<Nav>();

  return useCallback(
    (action: () => void, message?: string) => {
      if (isAuthenticated) {
        action();
      } else {
        navigation.navigate('AuthPrompt', message ? { message } : undefined);
      }
    },
    [isAuthenticated, navigation],
  );
}
