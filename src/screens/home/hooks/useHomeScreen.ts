import { useCallback } from 'react';
import { useAuthStore, useNotificationStore } from '@/store/app.store';
import { useHomeData } from '@/hooks/queries/home.queries';

export function useHomeScreen() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const homeQuery = useHomeData();
  const homeData = homeQuery.data?.data;

  const onRefresh = useCallback(async () => {
    await homeQuery.refetch();
  }, [homeQuery]);

  return {
    user,
    unreadCount,
    newArrivals: homeData?.newArrivals ?? [],
    allProducts: homeData?.featuredProducts ?? [],
    categories: homeData?.categories ?? [],
    nearbyProducts: homeData?.nearbyProducts ?? [],
    trends: homeData?.trends ?? [],
    isLoading: homeQuery.isLoading,
    isRefreshing: homeQuery.isRefetching,
    onRefresh,
  };
}
