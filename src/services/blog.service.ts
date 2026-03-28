// import { axiosInstance } from '@/lib/axios';
import { mockTrends } from '@/data/mock-trends.mock';
import type { TrendBlog } from '@/types/app.type';
import type { FilterBlogs, ResponseData, ResponsePagination } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 3000) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Service ─────────────────────────────────────────────────────────────────

export const blogService = {
  /**
   * GET /v1/blogs
   * Returns paginated blog / trend list with optional filters.
   */
  getAll: async (params?: FilterBlogs): Promise<ResponsePagination<TrendBlog>> => {
    // ── Real API (uncomment when backend is ready) ──────────────────────────
    // return axiosInstance.get('/blogs', { params });
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    let result = [...mockTrends];

    if (params?.topic) {
      result = result.filter((b) => b.topic === params.topic);
    }
    if (params?.isFeatured != null) {
      result = result.filter((b) => !!b.isFeatured === params.isFeatured);
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    const paged = result.slice(start, start + pageSize);

    return {
      data: paged,
      meta: { page, pageSize, total: result.length, totalPages: Math.ceil(result.length / pageSize) },
      success: true,
    };
  },

  /**
   * GET /v1/blogs/:id
   * Returns single blog post by ID.
   */
  getById: async (id: string): Promise<ResponseData<TrendBlog>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.get(`/blogs/${id}`);
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    const blog = mockTrends.find((b) => b.id === id);
    if (!blog) throw new Error(`Blog not found: ${id}`);

    return { data: blog, success: true };
  },
};
