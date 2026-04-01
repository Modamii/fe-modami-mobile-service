import { axiosClient, CORE_URL } from '@/lib/axios';
import { mockProducts } from '@/data/mock-products.mock';
import type { Product } from '@/types/app.type';
import type { FilterProducts, ResponseData, ResponsePagination } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const BASE = CORE_URL;

type CoreEnvelope<T> = {
  success?: boolean;
  data?: T;
  meta?: {
    page?: number;
    page_size?: number;
    total?: number;
    total_pages?: number;
  };
};

type CoreProduct = {
  id?: string;
  slug?: string;
  title?: string;
  price?: number;
  credit_cost?: number;
  images?: Array<{ url?: string } | string>;
  condition?: string;
  category_id?: string;
  category?: { id?: string; name?: string; name_vi?: string; slug?: string };
  brand?: string;
  size?: string;
  seller_id?: string;
  seller?: {
    id?: string;
    display_name?: string;
    full_name?: string;
    username?: string;
    rating?: number;
    review_count?: number;
    is_verified?: boolean;
  };
  seller_name?: string;
  location?: string;
  description?: string;
  created_at?: string;
  unlock_required?: boolean;
  material?: string;
  color?: string;
  year?: number;
  is_featured?: boolean;
  is_verified?: boolean;
  hashtags?: string[];
  view_count?: number;
  like_count?: number;
  seller_rating?: number;
  seller_review_count?: number;
};

function normalizeCondition(value?: string): Product['condition'] {
  const normalized = (value ?? '').replace('_', '-');
  if (normalized === 'new') return 'new';
  if (normalized === 'like-new') return 'like-new';
  if (normalized === 'fair') return 'fair';
  return 'good';
}

function normalizeImageList(images?: Array<{ url?: string } | string>): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((item) => (typeof item === 'string' ? item : item?.url))
    .filter((uri): uri is string => !!uri);
}

function mapCoreProductToAppProduct(item: CoreProduct): Product {
  const images = normalizeImageList(item.images);
  const sellerName =
    item.seller_name ??
    item.seller?.display_name ??
    item.seller?.full_name ??
    item.seller?.username ??
    'ModaMi Seller';

  return {
    id: item.id ?? '',
    slug: item.slug,
    title: item.title ?? 'Sản phẩm ModaMi',
    price: Number(item.price ?? 0),
    creditCost: Number(item.credit_cost ?? 0),
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'],
    condition: normalizeCondition(item.condition),
    category: item.category?.name ?? item.category?.name_vi ?? item.category_id ?? 'Other',
    brand: item.brand,
    size: item.size,
    sellerId: item.seller_id ?? item.seller?.id ?? '',
    sellerName,
    location: item.location,
    description: item.description,
    createdAt: item.created_at ?? new Date().toISOString(),
    isUnlockRequired: Boolean(item.unlock_required ?? true),
    material: item.material,
    color: item.color,
    year: item.year,
    isFeatured: item.is_featured,
    isVerified: item.is_verified ?? item.seller?.is_verified,
    tags: item.hashtags,
    viewCount: item.view_count,
    likeCount: item.like_count,
    sellerRating: item.seller_rating ?? item.seller?.rating,
    sellerReviewCount: item.seller_review_count ?? item.seller?.review_count,
  };
}

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

function buildSearchParams(params?: FilterProducts) {
  return {
    q: params?.search,
    category_id: params?.category,
    condition: params?.condition?.replace('-', '_'),
    min_price: params?.minPrice,
    max_price: params?.maxPrice,
    seller_id: params?.sellerId,
    limit: params?.pageSize,
  };
}

// ─── Local filter helper (mock-only, remove when API handles filtering) ───────

function applyFilters(products: Product[], params?: FilterProducts): Product[] {
  let result = [...products];

  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.brand ?? '').toLowerCase().includes(q),
    );
  }
  if (params?.category) {
    result = result.filter((p) => p.category === params.category);
  }
  if (params?.condition) {
    result = result.filter((p) => p.condition === params.condition);
  }
  if (params?.minPrice != null) {
    result = result.filter((p) => p.price >= params.minPrice!);
  }
  if (params?.maxPrice != null) {
    result = result.filter((p) => p.price <= params.maxPrice!);
  }
  if (params?.sellerId) {
    result = result.filter((p) => p.sellerId === params.sellerId);
  }

  return result;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const productService = {
  /**
   * GET /v1/products
   * Returns paginated product list with optional filters.
   */
  getAll: async (params?: FilterProducts): Promise<ResponsePagination<Product>> => {
    const fallback = async () => {
      await delay();

      const filtered = applyFilters(mockProducts, params);
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const start = (page - 1) * pageSize;
      const paged = filtered.slice(start, start + pageSize);

      return {
        data: paged,
        meta: {
          page,
          pageSize,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / pageSize),
        },
        success: true,
      };
    };

    try {
      const endpoint = '/products/search';
      let res: CoreEnvelope<unknown>;

      try {
        res = await axiosClient.get<CoreEnvelope<unknown>>(`${BASE}${endpoint}`, {
          params: buildSearchParams(params),
        }) as unknown as CoreEnvelope<unknown>;
      } catch {
        res = await axiosClient.get<CoreEnvelope<unknown>>(`${BASE}/search`, {
          params: buildSearchParams(params),
        }) as unknown as CoreEnvelope<unknown>;
      }

      const list = unwrapList<CoreProduct>(res.data).map(mapCoreProductToAppProduct);
      const page = params?.page ?? res.meta?.page ?? 1;
      const pageSize = params?.pageSize ?? res.meta?.page_size ?? (list.length || 20);
      const start = (page - 1) * pageSize;
      const paged = params?.page ? list.slice(start, start + pageSize) : list;
      const total = res.meta?.total ?? list.length;

      return {
        data: paged,
        meta: {
          page,
          pageSize,
          total,
          totalPages: res.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize)),
        },
        success: true,
      };
    } catch {
      return fallback();
    }
  },

  /**
   * GET /v1/products/:id
   * Returns single product by ID.
   */
  getById: async (id: string): Promise<ResponseData<Product>> => {
    try {
      const res = await axiosClient.get<CoreEnvelope<CoreProduct>>(
        `${BASE}/products/${id}`,
      ) as unknown as CoreEnvelope<CoreProduct>;

      if (!res.data) throw new Error('Empty product payload');

      return { data: mapCoreProductToAppProduct(res.data), success: true };
    } catch {
      await delay();

      const product = mockProducts.find((p) => p.id === id);
      if (!product) throw new Error(`Product not found: ${id}`);

      return { data: product, success: true };
    }
  },

  /**
   * GET /v1/products/saved
   * Returns products matching the given saved IDs.
   */
  getSaved: async (ids: string[]): Promise<ResponseData<Product[]>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.post('/products/saved', { ids });
    // ───────────────────────────────────────────────────────────────────────

    await delay(800);

    const saved = ids.length
      ? mockProducts.filter((p) => ids.includes(p.id))
      : [];

    return { data: saved, success: true };
  },

  /**
   * GET /v1/products/:id/similar
   * Returns similar products (same category, excludes current).
   */
  getSimilar: async (id: string, limit = 4): Promise<ResponseData<Product[]>> => {
    try {
      const res = await axiosClient.get<CoreEnvelope<unknown>>(
        `${BASE}/products/${id}/similar`,
        { params: { limit } },
      ) as unknown as CoreEnvelope<unknown>;

      const similar = unwrapList<CoreProduct>(res.data).map(mapCoreProductToAppProduct);
      return { data: similar.slice(0, limit), success: true };
    } catch {
      await delay();

      const current = mockProducts.find((p) => p.id === id);
      const similar = mockProducts
        .filter((p) => p.id !== id && (!current || p.category === current.category))
        .slice(0, limit);

      return { data: similar, success: true };
    }
  },
};
