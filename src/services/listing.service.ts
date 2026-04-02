import { axiosClient, CORE_URL } from '@/lib/axios';
import { mockMyListings } from '@/data/mock-my-listings.mock';
import type {
  MyListing,
  ListingStatus,
  ProductCondition,
} from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';
import type { StoreEnvelope, StoreProduct } from '@/types/store-core.types';

const delay = (ms = 300) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

const BASE = CORE_URL;

type CreateProductRequest = {
  title: string;
  price: number;
  description: string;
  category_id: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  size: string;
  brand?: string;
  images: Array<{
    url: string;
    position: number;
  }>;
};

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const candidate = data as { items?: unknown; products?: unknown; rows?: unknown };
    if (Array.isArray(candidate.items)) return candidate.items as T[];
    if (Array.isArray(candidate.products)) return candidate.products as T[];
    if (Array.isArray(candidate.rows)) return candidate.rows as T[];
  }
  return [];
}

function toCoreCondition(condition: ProductCondition): CreateProductRequest['condition'] {
  if (condition === 'like-new') return 'like_new';
  return condition;
}

export interface SubmitListingPayload {
  title: string;
  price: number;
  images: string[];
  category: string;
  condition: ProductCondition;
  brand?: string;
  description?: string;
  size?: string;
}

export const listingService = {
  async getMyListings(): Promise<ResponseData<MyListing[]>> {
    try {
      const res = await axiosClient.get<StoreEnvelope<unknown>>(
        `${BASE}/products/me`,
      ) as unknown as StoreEnvelope<unknown>;

      return {
        data: unwrapList<StoreProduct>(res.data) as unknown as MyListing[],
        success: true,
      };
    } catch {
      await delay();
      return { data: mockMyListings, success: true };
    }
  },

  async getListingById(id: string): Promise<ResponseData<MyListing>> {
    try {
      const res = await axiosClient.get<StoreEnvelope<StoreProduct>>(
        `${BASE}/products/${id}`,
      ) as unknown as StoreEnvelope<StoreProduct>;

      if (!res.data) throw new Error('Listing payload empty');
      return { data: res.data as unknown as MyListing, success: true };
    } catch {
      await delay(500);
      const listing = mockMyListings.find(l => l.id === id);
      if (!listing) throw new Error('Không tìm thấy bài đăng');
      return { data: listing, success: true };
    }
  },

  async getListingsByStatus(
    status: ListingStatus,
  ): Promise<ResponseData<MyListing[]>> {
    await delay();
    return {
      data: mockMyListings.filter(l => l.status === status),
      success: true,
    };
  },

  async submitListing(
    payload: SubmitListingPayload,
  ): Promise<ResponseData<MyListing>> {
    const fallback = async () => {
      await delay(1200);
      const now = new Date().toISOString();
      const newListing: MyListing = {
        id: `lst-${Date.now()}`,
        title: payload.title,
        price: payload.price,
        images:
          payload.images.length > 0
            ? payload.images
            : [
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
              ],
        category: payload.category,
        condition: payload.condition,
        status: 'pending',
        submittedAt: now,
        updatedAt: now,
      };
      mockMyListings.unshift(newListing);
      return { data: newListing, success: true };
    };

    try {
      const body: CreateProductRequest = {
        title: payload.title,
        price: payload.price,
        description: payload.description ?? 'San pham secondhand dang cho duyet tren ModaMi.',
        category_id: payload.category,
        condition: toCoreCondition(payload.condition),
        size: payload.size ?? 'Free size',
        brand: payload.brand,
        images: (payload.images.length > 0 ? payload.images : [
          'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
        ]).map((url, index) => ({
          url,
          position: index,
        })),
      };

      const res = await axiosClient.post<StoreEnvelope<StoreProduct>>(
        `${BASE}/products`,
        body,
      ) as unknown as StoreEnvelope<StoreProduct>;

      if (!res.data) throw new Error('Create listing payload empty');
      return {
        data: { ...res.data, status: res.data.status ?? 'pending' } as unknown as MyListing,
        success: true,
      };
    } catch {
      return fallback();
    }
  },
};
