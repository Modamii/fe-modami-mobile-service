import { useCallback } from 'react';
import { useAuthStore, useNotificationStore } from '@/store/app.store';
import { mockHomeCategories } from '@/data/mock-home-categories.mock';
import { mockNearbyProducts } from '@/data/mock-nearby-products.mock';
import { useProducts } from '@/hooks/queries/product.queries';
import { useBlogs } from '@/hooks/queries/blog.queries';
import type { Product } from '@/types/app.type';

function getNewArrivals(products: Product[], count = 4): Product[] {
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function useHomeScreen() {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const productsQuery = useProducts();
  const blogsQuery = useBlogs();

  const allProducts = productsQuery.data?.data ?? [];
  const newArrivals = getNewArrivals(allProducts);
  const trends = blogsQuery.data?.data ?? [];

  const isLoading = productsQuery.isLoading || blogsQuery.isLoading;
  const isRefreshing = productsQuery.isRefetching || blogsQuery.isRefetching;

  const onRefresh = useCallback(async () => {
    await Promise.all([productsQuery.refetch(), blogsQuery.refetch()]);
  }, [productsQuery, blogsQuery]);

  return {
    user,
    unreadCount,
    newArrivals,
    allProducts,
    categories: mockHomeCategories,
    nearbyProducts: mockNearbyProducts,
    trends,
    isLoading,
    isRefreshing,
    onRefresh,
  };
}
