import { useState, useMemo } from 'react';
import { mockProducts } from '@/data/mock-products.mock';
import type { Product } from '@/types/app.type';

function filterProducts(
  products: Product[],
  query: string,
  category: string | null,
): Product[] {
  return products.filter((p) => {
    const matchesQuery =
      !query || p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function useExploreScreen() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const results = useMemo(
    () => filterProducts(mockProducts, query, selectedCategory),
    [query, selectedCategory],
  );

  function toggleCategory(category: string | null) {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }

  function clearFilters() {
    setQuery('');
    setSelectedCategory(null);
  }

  return { query, setQuery, selectedCategory, toggleCategory, clearFilters, results };
}
