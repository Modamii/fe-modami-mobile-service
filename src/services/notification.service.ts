// import { axiosInstance } from '@/lib/axios';
import { mockNotifications } from '@/data/mock-notifications.mock';
import type { Notification } from '@/types/app.type';
import type { ResponseData, ResponsePagination } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Service ─────────────────────────────────────────────────────────────────

export const notificationService = {
  /**
   * GET /v1/notifications
   * Returns all notifications for the current user.
   */
  getAll: async (): Promise<ResponsePagination<Notification>> => {
    // ── Real API (uncomment when backend is ready) ──────────────────────────
    // return axiosInstance.get('/notifications');
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    return {
      data: mockNotifications,
      meta: { page: 1, pageSize: 50, total: mockNotifications.length, totalPages: 1 },
      success: true,
    };
  },

  /**
   * PATCH /v1/notifications/:id/read
   * Marks a single notification as read.
   */
  markRead: async (id: string): Promise<ResponseData<void>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.patch(`/notifications/${id}/read`);
    // ───────────────────────────────────────────────────────────────────────

    await delay(300);
    void id;

    return { data: undefined, success: true };
  },

  /**
   * PATCH /v1/notifications/read-all
   * Marks all notifications as read.
   */
  markAllRead: async (): Promise<ResponseData<void>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.patch('/notifications/read-all');
    // ───────────────────────────────────────────────────────────────────────

    await delay(300);

    return { data: undefined, success: true };
  },
};
