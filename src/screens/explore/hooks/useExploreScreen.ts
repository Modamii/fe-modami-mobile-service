import { useState, useMemo, useCallback } from 'react';
import { useProducts } from '@/hooks/queries/product.queries';
import type { Product, ProductCondition } from '@/types/app.type';

export interface ExploreFilters {
  conditions: ProductCondition[];
  priceMin: number | null;
  priceMax: number | null;
}

export const DEFAULT_FILTERS: ExploreFilters = {
  conditions: [],
  priceMin: null,
  priceMax: null,
};

function isFilterActive(filters: ExploreFilters): boolean {
  return (
    filters.conditions.length > 0 ||
    filters.priceMin !== null ||
    filters.priceMax !== null
  );
}

function filterLocally(
  products: Product[],
  query: string,
  category: string | null,
  filters: ExploreFilters,
): Product[] {
  return products.filter((p) => {
    const matchesQuery =
      !query || p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || p.category === category;
    const matchesCondition =
      filters.conditions.length === 0 || filters.conditions.includes(p.condition);
    const matchesPriceMin =
      filters.priceMin === null || p.price >= filters.priceMin;
    const matchesPriceMax =
      filters.priceMax === null || p.price <= filters.priceMax;
    return matchesQuery && matchesCategory && matchesCondition && matchesPriceMin && matchesPriceMax;
  });
}

export function useExploreScreen() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_FILTERS);

  const { data, isLoading, isRefetching, refetch } = useProducts();

  const allProducts = data?.data ?? [];

  const results = useMemo(
    () => filterLocally(allProducts, query, selectedCategory, filters),
    [allProducts, query, selectedCategory, filters],
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  function toggleCategory(category: string | null) {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }

  function clearFilters() {
    setQuery('');
    setSelectedCategory(null);
    setFilters(DEFAULT_FILTERS);
  }

  const hasActiveFilter = selectedCategory !== null || isFilterActive(filters);

  return {
    query,
    setQuery,
    selectedCategory,
    toggleCategory,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilter,
    results,
    isLoading,
    isRefreshing: isRefetching,
    onRefresh: handleRefresh,
  };
}
