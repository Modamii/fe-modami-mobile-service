import { useMemo } from 'react';
import { useAuthStore, useNotificationStore } from '@/store/app.store';
import { mockProducts } from '@/data/mock-products.mock';
import { mockHomeCategories } from '@/data/mock-home-categories.mock';
import { mockNearbyProducts } from '@/data/mock-nearby-products.mock';
import { mockTrends } from '@/data/mock-trends.mock';
import type { Product } from '@/types/app.type';

function getNewArrivals(products: Product[], count = 4): Product[] {
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function useHomeScreen() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const newArrivals = useMemo(() => getNewArrivals(mockProducts), []);
  const categories = useMemo(() => mockHomeCategories, []);
  const nearbyProducts = useMemo(() => mockNearbyProducts, []);
  const trends = useMemo(() => mockTrends, []);

  return { user, unreadCount, newArrivals, categories, nearbyProducts, trends };
}
