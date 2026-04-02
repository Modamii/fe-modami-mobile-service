import { axiosClient, CORE_URL } from '@/lib/axios';
import { getSellerProfile, getSellerProducts } from '@/data/mock-sellers.mock';
import type { SellerProfile, Product } from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';
import type {
  StoreEnvelope,
  StoreProduct,
  StoreSeller,
  StoreSellerReview,
  StoreSellerStats,
} from '@/types/store-core.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const BASE = CORE_URL;

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const candidate = data as { items?: unknown; products?: unknown; reviews?: unknown; rows?: unknown };
    if (Array.isArray(candidate.items)) return candidate.items as T[];
    if (Array.isArray(candidate.products)) return candidate.products as T[];
    if (Array.isArray(candidate.reviews)) return candidate.reviews as T[];
    if (Array.isArray(candidate.rows)) return candidate.rows as T[];
  }
  return [];
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const sellerService = {
  /**
   * GET /v1/sellers/:id
   * Returns seller profile.
   */
  getById: async (id: string): Promise<ResponseData<SellerProfile>> => {
    try {
      const [sellerRes, statsRes, reviewsRes] = await Promise.allSettled([
        axiosClient.get<StoreEnvelope<StoreSeller>>(`${BASE}/sellers/${id}`) as Promise<StoreEnvelope<StoreSeller>>,
        axiosClient.get<StoreEnvelope<StoreSellerStats>>(`${BASE}/sellers/${id}/stats`) as Promise<StoreEnvelope<StoreSellerStats>>,
        axiosClient.get<StoreEnvelope<unknown>>(`${BASE}/sellers/${id}/reviews`) as Promise<StoreEnvelope<unknown>>,
      ]);

      if (sellerRes.status !== 'fulfilled' || !sellerRes.value.data) {
        throw new Error('Seller profile unavailable');
      }

      return {
        data: {
          ...(sellerRes.value.data as object),
          ...(statsRes.status === 'fulfilled' ? statsRes.value.data : undefined),
          ...(reviewsRes.status === 'fulfilled'
            ? { reviews: unwrapList<StoreSellerReview>(reviewsRes.value.data) }
            : undefined),
        } as SellerProfile,
        success: true,
      };
    } catch {
      await delay();

      const seller = getSellerProfile(id);
      if (!seller) throw new Error(`Seller not found: ${id}`);

      return { data: seller, success: true };
    }
  },

  /**
   * GET /v1/sellers/:id/products
   * Returns all active listings by this seller.
   */
  getProducts: async (sellerId: string): Promise<ResponseData<Product[]>> => {
    try {
      const res = await axiosClient.get<StoreEnvelope<unknown>>(
        `${BASE}/sellers/${sellerId}/products`,
      ) as unknown as StoreEnvelope<unknown>;

      return {
        data: unwrapList<StoreProduct>(res.data) as unknown as Product[],
        success: true,
      };
    } catch {
      await delay();

      const products = getSellerProducts(sellerId);
      return { data: products, success: true };
    }
  },
};
