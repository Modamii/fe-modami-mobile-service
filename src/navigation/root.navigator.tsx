import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './navigation.type';
import { MainTabNavigator } from './main-tab.navigator';
import { useAppStore } from '@/store/app.store';
import { COLORS } from '@/constants/app.constants';

import { OnboardingScreen } from '@/screens/onboarding/onboarding.screen';
import { ProductDetailScreen } from '@/screens/product/product-detail.screen';
import { SellerDetailScreen } from '@/screens/seller/seller-detail.screen';
import { BlogDetailScreen } from '@/screens/blog/blog-detail.screen';
import { TrendsListScreen } from '@/screens/trends/trends-list.screen';
import { ConversationScreen } from '@/screens/messages/conversation.screen';
import { NotificationsScreen } from '@/screens/notifications/notifications.screen';
import { NotificationDetailScreen } from '@/screens/notifications/notification-detail.screen';
import { MembershipScreen } from '@/screens/profile/membership.screen';
import { CreditsScreen } from '@/screens/profile/credits.screen';
import { DashboardScreen } from '@/screens/dashboard/dashboard.screen';
import { EditProfileScreen } from '@/screens/profile/edit-profile.screen';
import { SavedScreen } from '@/screens/saved/saved.screen';
import { MyListingsScreen } from '@/screens/my-listings/my-listings.screen';
import { ListingDetailScreen } from '@/screens/my-listings/listing-detail.screen';
import { ListingSuccessScreen } from '@/screens/post-listing/listing-success.screen';
import { OrderHistoryScreen } from '@/screens/orders/order-history.screen';
import { LoginScreen } from '@/screens/auth/login.screen';
import { RegisterScreen } from '@/screens/auth/register.screen';
import { ForgotPasswordScreen } from '@/screens/auth/forgot-password.screen';
import { AuthPromptScreen } from '@/screens/auth/auth-prompt.screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const headerBase = {
  headerShown: true,
  headerBackButtonDisplayMode: 'minimal' as const,
  headerStyle: { backgroundColor: COLORS.surface },
  headerTintColor: COLORS.onSurface,
  headerShadowVisible: false,
};

export function RootNavigator() {
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
      ) : (
        <>
          {/* ── Main app (always accessible) ── */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="SellerDetail" component={SellerDetailScreen} />
          <Stack.Screen
            name="BlogDetail"
            component={BlogDetailScreen}
            options={{ ...headerBase, title: 'Bài viết' }}
          />
          <Stack.Screen
            name="TrendsList"
            component={TrendsListScreen}
            options={{ ...headerBase, title: 'Xu hướng & cộng đồng' }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ ...headerBase, title: 'Thông báo', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="NotificationDetail"
            component={NotificationDetailScreen}
            options={{ ...headerBase, title: 'Chi tiết thông báo' }}
          />
          <Stack.Screen
            name="Membership"
            component={MembershipScreen}
            options={{ ...headerBase, title: 'Gói thành viên' }}
          />
          <Stack.Screen
            name="Credits"
            component={CreditsScreen}
            options={{ ...headerBase, title: 'ModaMi Credits' }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ ...headerBase, title: 'Bảng điều khiển' }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ ...headerBase, title: 'Chỉnh sửa hồ sơ' }}
          />
          <Stack.Screen
            name="Saved"
            component={SavedScreen}
            options={{ ...headerBase, title: 'Đã lưu' }}
          />
          <Stack.Screen
            name="MyListings"
            component={MyListingsScreen}
            options={{ ...headerBase, title: 'Bài đăng của tôi' }}
          />
          <Stack.Screen
            name="ListingDetail"
            component={ListingDetailScreen}
            options={{ ...headerBase, title: 'Chi tiết bài đăng' }}
          />
          <Stack.Screen
            name="ListingSuccess"
            component={ListingSuccessScreen}
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{ ...headerBase, title: 'Lịch sử mua hàng' }}
          />
          <Stack.Screen name="Conversation" component={ConversationScreen} />

          {/* ── Auth (modal presentations) ── */}
          <Stack.Screen
            name="AuthPrompt"
            component={AuthPromptScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
