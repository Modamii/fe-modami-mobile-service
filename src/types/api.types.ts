import type { HomeCategory, NearbyProduct, Product, TrendBlog } from './app.type';

// ─── Common response wrappers ────────────────────────────────────────────────

export interface ResponseData<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ResponsePagination<T> {
  data: T[];
  meta: PaginationMeta;
  success: boolean;
}

// ─── Domain response shapes ───────────────────────────────────────────────────

export interface HomeScreenData {
  newArrivals: Product[];
  featuredProducts: Product[];
  categories: HomeCategory[];
  nearbyProducts: NearbyProduct[];
  trends: TrendBlog[];
}

// ─── Filter params ────────────────────────────────────────────────────────────

export interface FilterProducts {
  search?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  page?: number;
  pageSize?: number;
}

export interface FilterBlogs {
  topic?: string;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
}
