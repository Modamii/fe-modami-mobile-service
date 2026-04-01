import { axiosClient, CORE_URL } from '@/lib/axios';
import { mockProducts } from '@/data/mock-products.mock';
import { mockTrends } from '@/data/mock-trends.mock';
import { mockHomeCategories } from '@/data/mock-home-categories.mock';
import { mockNearbyProducts } from '@/data/mock-nearby-products.mock';
import type { HomeCategory, Product } from '@/types/app.type';
import type { HomeScreenData, ResponseData } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const BASE = CORE_URL;

type CoreEnvelope<T> = {
  success?: boolean;
  data?: T;
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
  category?: { id?: string; name?: string; name_vi?: string };
  brand?: string;
  size?: string;
  seller_id?: string;
  seller_name?: string;
  seller?: {
    id?: string;
    display_name?: string;
    full_name?: string;
    username?: string;
    rating?: number;
    review_count?: number;
    is_verified?: boolean;
  };
  location?: string;
  description?: string;
  created_at?: string;
  unlock_required?: boolean;
  is_featured?: boolean;
  is_verified?: boolean;
  view_count?: number;
  like_count?: number;
  hashtags?: string[];
};

type CoreCategory = {
  id?: string;
  name?: string;
  name_vi?: string;
  slug?: string;
  icon?: string;
  image?: string;
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
    sellerName:
      item.seller_name ??
      item.seller?.display_name ??
      item.seller?.full_name ??
      item.seller?.username ??
      'ModaMi Seller',
    location: item.location,
    description: item.description,
    createdAt: item.created_at ?? new Date().toISOString(),
    isUnlockRequired: Boolean(item.unlock_required ?? true),
    isFeatured: item.is_featured,
    isVerified: item.is_verified ?? item.seller?.is_verified,
    tags: item.hashtags,
    viewCount: item.view_count,
    likeCount: item.like_count,
    sellerRating: item.seller?.rating,
    sellerReviewCount: item.seller?.review_count,
  };
}

function mapCoreCategoryToHomeCategory(item: CoreCategory): HomeCategory {
  return {
    id: item.id ?? item.slug ?? `cat-${item.name ?? 'unknown'}`,
    label: item.name_vi ?? item.name ?? 'Danh mục',
    image:
      item.image ??
      item.icon ??
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: item.name ?? item.slug ?? 'other',
  };
}

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const candidate = data as { items?: unknown; products?: unknown; categories?: unknown; rows?: unknown };
    if (Array.isArray(candidate.items)) return candidate.items as T[];
    if (Array.isArray(candidate.products)) return candidate.products as T[];
    if (Array.isArray(candidate.categories)) return candidate.categories as T[];
    if (Array.isArray(candidate.rows)) return candidate.rows as T[];
  }
  return [];
}

async function getCoreProducts(path: string, limit: number): Promise<Product[]> {
  const res = await axiosClient.get<CoreEnvelope<unknown>>(`${BASE}${path}`, {
    params: { limit },
  }) as unknown as CoreEnvelope<unknown>;
  return unwrapList<CoreProduct>(res.data).map(mapCoreProductToAppProduct);
}

export const homeService = {
  /**
   * GET /v1/home
   * Returns all sections for the home screen in a single request.
   */
  getHomeData: async (): Promise<ResponseData<HomeScreenData>> => {
    const fallback = async () => {
      await delay();

      const newArrivals = [...mockProducts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

      return {
        data: {
          newArrivals,
          featuredProducts: mockProducts,
          categories: mockHomeCategories,
          nearbyProducts: mockNearbyProducts,
          trends: mockTrends,
        },
        success: true,
      };
    };

    const [feedRes, featuredRes, selectRes, categoriesRes] = await Promise.allSettled([
      getCoreProducts('/products/feed', 24),
      getCoreProducts('/products/featured', 24),
      getCoreProducts('/products/select', 24),
      axiosClient.get<CoreEnvelope<unknown>>(`${BASE}/categories`) as Promise<CoreEnvelope<unknown>>,
    ]);

    const feedProducts = feedRes.status === 'fulfilled' ? feedRes.value : [];
    const featuredProducts = featuredRes.status === 'fulfilled' ? featuredRes.value : [];
    const selectProducts = selectRes.status === 'fulfilled' ? selectRes.value : [];

    const hasCoreData =
      feedProducts.length > 0 || featuredProducts.length > 0 || selectProducts.length > 0;

    if (!hasCoreData && categoriesRes.status === 'rejected') {
      return fallback();
    }

    const categories =
      categoriesRes.status === 'fulfilled'
        ? unwrapList<CoreCategory>(categoriesRes.value.data).map(mapCoreCategoryToHomeCategory)
        : mockHomeCategories;

    let mergedFeatured = feedProducts;
    if (featuredProducts.length > 0) {
      mergedFeatured = featuredProducts;
    } else if (selectProducts.length > 0) {
      mergedFeatured = selectProducts;
    }

    const sourceForNewArrivals = feedProducts.length > 0 ? feedProducts : mergedFeatured;
    const newArrivals = [...sourceForNewArrivals]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);

    return {
      data: {
        newArrivals,
        featuredProducts: mergedFeatured,
        categories: categories.length > 0 ? categories : mockHomeCategories,
        nearbyProducts: mockNearbyProducts,
        trends: mockTrends,
      },
      success: true,
    };
  },
};
