import { axiosClient, CORE_URL } from '@/lib/axios';
import { mockProducts } from '@/data/mock-products.mock';
import { mockTrends } from '@/data/mock-trends.mock';
import { mockHomeCategories } from '@/data/mock-home-categories.mock';
import { mockNearbyProducts } from '@/data/mock-nearby-products.mock';
import type { HomeCategory, Product } from '@/types/app.type';
import type { HomeScreenData, ResponseData } from '@/types/api.types';
import type { StoreCategory, StoreEnvelope, StoreProduct } from '@/types/store-core.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const BASE = CORE_URL;

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
  const res = await axiosClient.get<StoreEnvelope<unknown>>(`${BASE}${path}`, {
    params: { limit },
  }) as unknown as StoreEnvelope<unknown>;
  return unwrapList<StoreProduct>(res.data) as unknown as Product[];
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
      axiosClient.get<StoreEnvelope<unknown>>(`${BASE}/categories`) as Promise<StoreEnvelope<unknown>>,
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
        ? (unwrapList<StoreCategory>(categoriesRes.value.data) as unknown as HomeCategory[])
        : mockHomeCategories;

    let mergedFeatured = feedProducts;
    if (featuredProducts.length > 0) {
      mergedFeatured = featuredProducts;
    } else if (selectProducts.length > 0) {
      mergedFeatured = selectProducts;
    }

    const sourceForNewArrivals = feedProducts.length > 0 ? feedProducts : mergedFeatured;
    const newArrivals = [...sourceForNewArrivals]
      .sort(
        (a, b) =>
          new Date((b as StoreProduct).created_at ?? b.createdAt ?? 0).getTime() -
          new Date((a as StoreProduct).created_at ?? a.createdAt ?? 0).getTime(),
      )
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
