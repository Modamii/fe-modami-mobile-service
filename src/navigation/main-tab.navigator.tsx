import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MainTabParamList } from './navigation.type';
import { HomeScreen } from '@/screens/home/home.screen';
import { ExploreScreen } from '@/screens/explore/explore.screen';
import { PostListingScreen } from '@/screens/post-listing/post-listing.screen';
import { MessagesScreen } from '@/screens/messages/messages.screen';
import { ProfileScreen } from '@/screens/profile/profile.screen';
import { COLORS } from '@/constants/app.constants';
import { TabBarIcon } from '@/components/atoms/tab-bar-icon.component';
import { useNotificationStore } from '@/store/app.store';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 4,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="search" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="PostListing"
        component={PostListingScreen}
        options={{
          tabBarLabel: 'Đăng bán',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="plus-circle" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="message-circle" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Hồ sơ',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
}
