// import { axiosInstance } from '@/lib/axios';
import { mockProducts } from '@/data/mock-products.mock';
import type { Product } from '@/types/app.type';
import type { FilterProducts, ResponseData, ResponsePagination } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

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
    // ── Real API (uncomment when backend is ready) ──────────────────────────
    // return axiosInstance.get('/products', { params });
    // ───────────────────────────────────────────────────────────────────────

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
  },

  /**
   * GET /v1/products/:id
   * Returns single product by ID.
   */
  getById: async (id: string): Promise<ResponseData<Product>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.get(`/products/${id}`);
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error(`Product not found: ${id}`);

    return { data: product, success: true };
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
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.get(`/products/${id}/similar`, { params: { limit } });
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    const current = mockProducts.find((p) => p.id === id);
    const similar = mockProducts
      .filter((p) => p.id !== id && (!current || p.category === current.category))
      .slice(0, limit);

    return { data: similar, success: true };
  },
};
