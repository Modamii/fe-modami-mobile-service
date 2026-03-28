import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type { FilterProducts } from '@/types/api.types';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: FilterProducts) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  similar: (id: string) => [...productKeys.all, 'similar', id] as const,
  saved: (ids: string[]) => [...productKeys.all, 'saved', ids] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch paginated product list with optional filters.
 * Returns loading, error, data, and refetch (for pull-to-refresh).
 */
export function useProducts(filters?: FilterProducts) {
  return useQuery({
    queryKey: productKeys.list(filters ?? {}),
    queryFn: () => productService.getAll(filters),
  });
}

/**
 * Fetch a single product by ID.
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

/**
 * Fetch saved/favorited products by their IDs.
 * Query key includes IDs so cache updates when favorites change.
 */
export function useSavedProducts(ids: string[]) {
  return useQuery({
    queryKey: productKeys.saved(ids),
    queryFn: () => productService.getSaved(ids),
  });
}

/**
 * Fetch similar products (same category, excludes current).
 */
export function useSimilarProducts(id: string, limit = 4) {
  return useQuery({
    queryKey: productKeys.similar(id),
    queryFn: () => productService.getSimilar(id, limit),
    enabled: !!id,
  });
}
