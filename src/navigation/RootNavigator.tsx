import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore } from '@/store';
import { COLORS } from '@/constants';

// Screens loaded lazily to keep the bundle small
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { MembershipScreen } from '@/screens/profile/MembershipScreen';
import { CreditsScreen } from '@/screens/profile/CreditsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              headerShown: true,
              title: 'Thông báo',
              headerStyle: { backgroundColor: COLORS.surface },
              headerTintColor: COLORS.onSurface,
              headerShadowVisible: false,
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="Membership"
            component={MembershipScreen}
            options={{
              headerShown: true,
              title: 'Gói thành viên',
              headerStyle: { backgroundColor: COLORS.surface },
              headerTintColor: COLORS.onSurface,
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="Credits"
            component={CreditsScreen}
            options={{
              headerShown: true,
              title: 'ModaMi Credits',
              headerStyle: { backgroundColor: COLORS.surface },
              headerTintColor: COLORS.onSurface,
              headerShadowVisible: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
