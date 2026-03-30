// import { axiosInstance } from '@/lib/axios';
import {
  CREDIT_PACKAGES,
  MOCK_CREDIT_HISTORY,
  type CreditPackage,
  type CreditHistoryItem,
} from '@/data/mock-credits.mock';
import type { ResponseData, ResponsePagination } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Service ─────────────────────────────────────────────────────────────────

export const creditService = {
  /**
   * GET /v1/credits/packages
   * Returns available credit packages to purchase.
   */
  getPackages: async (): Promise<ResponsePagination<CreditPackage>> => {
    // ── Real API (uncomment when backend is ready) ──────────────────────────
    // return axiosInstance.get('/credits/packages');
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    return {
      data: CREDIT_PACKAGES,
      meta: { page: 1, pageSize: 20, total: CREDIT_PACKAGES.length, totalPages: 1 },
      success: true,
    };
  },

  /**
   * GET /v1/credits/history
   * Returns transaction history for the current user.
   */
  getHistory: async (): Promise<ResponsePagination<CreditHistoryItem>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.get('/credits/history');
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    return {
      data: MOCK_CREDIT_HISTORY,
      meta: { page: 1, pageSize: 50, total: MOCK_CREDIT_HISTORY.length, totalPages: 1 },
      success: true,
    };
  },

  /**
   * POST /v1/credits/purchase
   * Initiates a credit purchase for the given package ID.
   */
  purchase: async (packageId: string): Promise<ResponseData<{ checkoutUrl: string }>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.post('/credits/purchase', { packageId });
    // ───────────────────────────────────────────────────────────────────────

    await delay(1000);
    void packageId;

    // Mock: no real checkout URL yet
    return { data: { checkoutUrl: '' }, success: true };
  },
};
