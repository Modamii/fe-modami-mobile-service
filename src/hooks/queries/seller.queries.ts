import { useQuery } from '@tanstack/react-query';
import { sellerService } from '@/services/seller.service';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const sellerKeys = {
  all: ['sellers'] as const,
  details: () => [...sellerKeys.all, 'detail'] as const,
  detail: (id: string) => [...sellerKeys.details(), id] as const,
  products: (id: string) => [...sellerKeys.all, 'products', id] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch seller profile by ID.
 */
export function useSeller(id: string) {
  return useQuery({
    queryKey: sellerKeys.detail(id),
    queryFn: () => sellerService.getById(id),
    enabled: !!id,
  });
}

/**
 * Fetch all products listed by this seller.
 */
export function useSellerProducts(sellerId: string) {
  return useQuery({
    queryKey: sellerKeys.products(sellerId),
    queryFn: () => sellerService.getProducts(sellerId),
    enabled: !!sellerId,
  });
}
