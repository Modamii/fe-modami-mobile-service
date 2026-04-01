import { axiosClient, CORE_URL } from '@/lib/axios';
import { mockMyListings } from '@/data/mock-my-listings.mock';
import type {
  MyListing,
  ListingStatus,
  ProductCondition,
} from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';

const delay = (ms = 300) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

const BASE = CORE_URL;

type CoreEnvelope<T> = {
  success?: boolean;
  data?: T;
};

type CoreProduct = {
  id?: string;
  title?: string;
  price?: number;
  images?: Array<{ url?: string } | string>;
  category_id?: string;
  category?: { id?: string; name?: string; name_vi?: string };
  condition?: string;
  status?: string;
  submitted_at?: string;
  updated_at?: string;
  created_at?: string;
  moderation?: {
    reviewed_at?: string;
    reviewer_name?: string;
    reason_category?: string;
    notes?: string;
    suggested_action?: string;
  };
};

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

function normalizeCondition(value?: string): MyListing['condition'] {
  const normalized = (value ?? '').replace('_', '-');
  if (normalized === 'new') return 'new';
  if (normalized === 'like-new') return 'like-new';
  if (normalized === 'fair') return 'fair';
  return 'good';
}

function normalizeStatus(value?: string): ListingStatus {
  const normalized = (value ?? '').toLowerCase();
  if (normalized === 'pending') return 'pending';
  if (normalized === 'under_review' || normalized === 'reviewing') return 'under_review';
  if (normalized === 'approved' || normalized === 'published' || normalized === 'active') return 'approved';
  if (normalized === 'rejected') return 'rejected';
  if (normalized === 'sold') return 'sold';
  return 'pending';
}

function normalizeImageList(images?: Array<{ url?: string } | string>): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map(item => (typeof item === 'string' ? item : item?.url))
    .filter((uri): uri is string => !!uri);
}

function mapCoreProductToMyListing(item: CoreProduct): MyListing {
  const submittedAt = item.submitted_at ?? item.created_at ?? new Date().toISOString();
  const updatedAt = item.updated_at ?? submittedAt;
  const status = normalizeStatus(item.status);

  return {
    id: item.id ?? `lst-${Date.now()}`,
    title: item.title ?? 'Bai dang ModaMi',
    price: Number(item.price ?? 0),
    images: normalizeImageList(item.images),
    category: item.category?.name ?? item.category?.name_vi ?? item.category_id ?? 'Other',
    condition: normalizeCondition(item.condition),
    status,
    submittedAt,
    updatedAt,
    productId: status === 'approved' || status === 'sold' ? item.id : undefined,
    adminFeedback: status === 'rejected'
      ? {
          reviewedAt: item.moderation?.reviewed_at ?? updatedAt,
          reviewerName: item.moderation?.reviewer_name ?? 'ModaMi Team',
          reasonCategory: item.moderation?.reason_category ?? 'Can cap nhat bai dang',
          notes: item.moderation?.notes ?? 'Bai dang can bo sung thong tin de tiep tuc duyet.',
          suggestedAction: item.moderation?.suggested_action,
        }
      : undefined,
  };
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
      const res = await axiosClient.get<CoreEnvelope<unknown>>(
        `${BASE}/products/me`,
      ) as unknown as CoreEnvelope<unknown>;

      return {
        data: unwrapList<CoreProduct>(res.data).map(mapCoreProductToMyListing),
        success: true,
      };
    } catch {
      await delay();
      return { data: mockMyListings, success: true };
    }
  },

  async getListingById(id: string): Promise<ResponseData<MyListing>> {
    try {
      const res = await axiosClient.get<CoreEnvelope<CoreProduct>>(
        `${BASE}/products/${id}`,
      ) as unknown as CoreEnvelope<CoreProduct>;

      if (!res.data) throw new Error('Listing payload empty');
      return { data: mapCoreProductToMyListing(res.data), success: true };
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

      const res = await axiosClient.post<CoreEnvelope<CoreProduct>>(
        `${BASE}/products`,
        body,
      ) as unknown as CoreEnvelope<CoreProduct>;

      if (!res.data) throw new Error('Create listing payload empty');
      return {
        data: mapCoreProductToMyListing({ ...res.data, status: res.data.status ?? 'pending' }),
        success: true,
      };
    } catch {
      return fallback();
    }
  },
};
