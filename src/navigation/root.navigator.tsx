import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './navigation.type';
import { AuthNavigator } from './auth.navigator';
import { MainTabNavigator } from './main-tab.navigator';
import { useAuthStore, useAppStore } from '@/store/app.store';
import { COLORS } from '@/constants/app.constants';

import { OnboardingScreen } from '@/screens/onboarding/onboarding.screen';
import { ProductDetailScreen } from '@/screens/product/product-detail.screen';
import { ConversationScreen } from '@/screens/messages/conversation.screen';
import { NotificationsScreen } from '@/screens/notifications/notifications.screen';
import { MembershipScreen } from '@/screens/profile/membership.screen';
import { CreditsScreen } from '@/screens/profile/credits.screen';

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
              headerBackButtonDisplayMode: 'minimal',
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
              headerBackButtonDisplayMode: 'minimal',
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
              headerBackButtonDisplayMode: 'minimal',
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
