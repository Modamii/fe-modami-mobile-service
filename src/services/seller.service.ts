// import { axiosInstance } from '@/lib/axios';
import { getSellerProfile, getSellerProducts } from '@/data/mock-sellers.mock';
import type { SellerProfile, Product } from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Service ─────────────────────────────────────────────────────────────────

export const sellerService = {
  /**
   * GET /v1/sellers/:id
   * Returns seller profile.
   */
  getById: async (id: string): Promise<ResponseData<SellerProfile>> => {
    // ── Real API (uncomment when backend is ready) ──────────────────────────
    // return axiosInstance.get(`/sellers/${id}`);
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    const seller = getSellerProfile(id);
    if (!seller) throw new Error(`Seller not found: ${id}`);

    return { data: seller, success: true };
  },

  /**
   * GET /v1/sellers/:id/products
   * Returns all active listings by this seller.
   */
  getProducts: async (sellerId: string): Promise<ResponseData<Product[]>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.get(`/sellers/${sellerId}/products`);
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    const products = getSellerProducts(sellerId);
    return { data: products, success: true };
  },
};
