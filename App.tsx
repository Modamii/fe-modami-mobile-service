import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'react-native';
import { RootNavigator } from '@/navigation/root.navigator';
import { QueryProvider } from '@/providers/query.provider';
import { COLORS } from '@/constants/app.constants';
import { setUnauthorizedHandler } from '@/lib/axios';
import { useAuthStore } from '@/store/app.store';

// Đăng ký handler: khi token hết hạn và refresh thất bại → tự động logout
setUnauthorizedHandler(() => useAuthStore.getState().logout());

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <BottomSheetModalProvider>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
