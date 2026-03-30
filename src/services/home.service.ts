// import { axiosInstance } from '@/lib/axios';
import { mockProducts } from '@/data/mock-products.mock';
import { mockTrends } from '@/data/mock-trends.mock';
import { mockHomeCategories } from '@/data/mock-home-categories.mock';
import { mockNearbyProducts } from '@/data/mock-nearby-products.mock';
import type { HomeScreenData, ResponseData } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const homeService = {
  /**
   * GET /v1/home
   * Returns all sections for the home screen in a single request.
   */
  getHomeData: async (): Promise<ResponseData<HomeScreenData>> => {
    // ── Real API (uncomment when backend is ready) ────────────────────────
    // return axiosInstance.get('/home');
    // ─────────────────────────────────────────────────────────────────────

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
  },
};
