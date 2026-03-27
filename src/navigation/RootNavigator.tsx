import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { useAuthStore, useAppStore } from '@/store';
import { COLORS } from '@/constants';

import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { ProductDetailScreen } from '@/screens/product/ProductDetailScreen';
import { ConversationScreen } from '@/screens/messages/ConversationScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { MembershipScreen } from '@/screens/profile/MembershipScreen';
import { CreditsScreen } from '@/screens/profile/CreditsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      {!hasSeenOnboarding ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: 'fade' }}
        />
      ) : isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
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
          <Stack.Screen
            name="Conversation"
            component={ConversationScreen}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
