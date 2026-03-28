// import { axiosInstance } from '@/lib/axios';
import {
  MOCK_DASHBOARD_LISTINGS,
  MOCK_DASHBOARD_FEATURED,
  MOCK_DASHBOARD_CONTACTS,
  MOCK_DASHBOARD_CREDIT_HISTORY,
  type DashboardListingRow,
  type DashboardFeaturedRow,
  type DashboardContactRow,
  type DashboardCreditRow,
} from '@/data/mock-dashboard.mock';
import type { ResponseData } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 3000) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface DashboardSummary {
  listings: DashboardListingRow[];
  featured: DashboardFeaturedRow[];
  contacts: DashboardContactRow[];
  creditHistory: DashboardCreditRow[];
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const dashboardService = {
  /**
   * GET /v1/dashboard
   * Returns seller dashboard summary (listings, featured, contacts, credit history).
   */
  getSummary: async (): Promise<ResponseData<DashboardSummary>> => {
    // ── Real API (uncomment when backend is ready) ──────────────────────────
    // return axiosInstance.get('/dashboard');
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    return {
      data: {
        listings: MOCK_DASHBOARD_LISTINGS,
        featured: MOCK_DASHBOARD_FEATURED,
        contacts: MOCK_DASHBOARD_CONTACTS,
        creditHistory: MOCK_DASHBOARD_CREDIT_HISTORY,
      },
      success: true,
    };
  },
};
