import { axiosClient, CORE_URL } from '@/lib/axios';
import { getSellerProfile, getSellerProducts } from '@/data/mock-sellers.mock';
import type { SellerProfile, Product } from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const BASE = CORE_URL;

type CoreEnvelope<T> = {
  success?: boolean;
  data?: T;
};

type CoreSeller = {
  id?: string;
  display_name?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  location?: string;
  created_at?: string;
  is_verified?: boolean;
  rating?: number;
  review_count?: number;
  sold_count?: number;
};

type CoreSellerStats = {
  sold_count?: number;
  rating?: number;
  review_count?: number;
};

type CoreSellerReview = {
  id?: string;
  buyer_name?: string;
  rating?: number;
  comment?: string;
  product_title?: string;
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
  seller?: {
    id?: string;
    display_name?: string;
    full_name?: string;
    username?: string;
    rating?: number;
    review_count?: number;
    is_verified?: boolean;
  };
  seller_name?: string;
  location?: string;
  description?: string;
  created_at?: string;
  unlock_required?: boolean;
  is_featured?: boolean;
  is_verified?: boolean;
  hashtags?: string[];
  view_count?: number;
  like_count?: number;
  seller_rating?: number;
  seller_review_count?: number;
};

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const candidate = data as { items?: unknown; products?: unknown; reviews?: unknown; rows?: unknown };
    if (Array.isArray(candidate.items)) return candidate.items as T[];
    if (Array.isArray(candidate.products)) return candidate.products as T[];
    if (Array.isArray(candidate.reviews)) return candidate.reviews as T[];
    if (Array.isArray(candidate.rows)) return candidate.rows as T[];
  }
  return [];
}

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
  const sellerName =
    item.seller_name ??
    item.seller?.display_name ??
    item.seller?.full_name ??
    item.seller?.username ??
    'ModaMi Seller';

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
    sellerName,
    location: item.location,
    description: item.description,
    createdAt: item.created_at ?? new Date().toISOString(),
    isUnlockRequired: Boolean(item.unlock_required ?? true),
    isFeatured: item.is_featured,
    isVerified: item.is_verified ?? item.seller?.is_verified,
    tags: item.hashtags,
    viewCount: item.view_count,
    likeCount: item.like_count,
    sellerRating: item.seller_rating ?? item.seller?.rating,
    sellerReviewCount: item.seller_review_count ?? item.seller?.review_count,
  };
}

function toJoinedAtLabel(createdAt?: string): string {
  if (!createdAt) return 'Tham gia ModaMi';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Tham gia ModaMi';
  return `Tham gia từ T${date.getMonth() + 1}, ${date.getFullYear()}`;
}

function mapCoreSellerToProfile(
  seller: CoreSeller,
  stats?: CoreSellerStats,
  reviews: CoreSellerReview[] = [],
): SellerProfile {
  const displayName =
    seller.display_name ?? seller.full_name ?? seller.username ?? 'ModaMi Seller';

  const mappedReviews = reviews.map((review, index) => {
    const buyerName = review.buyer_name ?? 'Người mua ModaMi';
    return {
      id: review.id ?? `${seller.id ?? 'seller'}-review-${index}`,
      buyerName,
      buyerInitial: buyerName.charAt(0).toUpperCase(),
      rating: Number(review.rating ?? 5),
      comment: review.comment ?? 'Giao dịch tốt, mô tả đúng sản phẩm.',
      boughtProductTitle: review.product_title ?? 'Sản phẩm ModaMi',
    };
  });

  return {
    id: seller.id ?? '',
    displayName,
    username: seller.username ? `@${seller.username.replace(/^@/, '')}` : '@modami_seller',
    avatarUrl: seller.avatar_url,
    coverImageUrl:
      seller.cover_url ??
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    bio: seller.bio ?? `Shop thời trang secondhand của ${displayName} trên ModaMi.`,
    location: seller.location ?? 'Việt Nam',
    joinedAtLabel: toJoinedAtLabel(seller.created_at),
    soldCount: Number(stats?.sold_count ?? seller.sold_count ?? 0),
    isVerified: Boolean(seller.is_verified),
    rating: Number(stats?.rating ?? seller.rating ?? 4.8),
    reviewCount: Number(stats?.review_count ?? seller.review_count ?? mappedReviews.length),
    reviews: mappedReviews,
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const sellerService = {
  /**
   * GET /v1/sellers/:id
   * Returns seller profile.
   */
  getById: async (id: string): Promise<ResponseData<SellerProfile>> => {
    try {
      const [sellerRes, statsRes, reviewsRes] = await Promise.allSettled([
        axiosClient.get<CoreEnvelope<CoreSeller>>(`${BASE}/sellers/${id}`) as Promise<CoreEnvelope<CoreSeller>>,
        axiosClient.get<CoreEnvelope<CoreSellerStats>>(`${BASE}/sellers/${id}/stats`) as Promise<CoreEnvelope<CoreSellerStats>>,
        axiosClient.get<CoreEnvelope<unknown>>(`${BASE}/sellers/${id}/reviews`) as Promise<CoreEnvelope<unknown>>,
      ]);

      if (sellerRes.status !== 'fulfilled' || !sellerRes.value.data) {
        throw new Error('Seller profile unavailable');
      }

      const stats = statsRes.status === 'fulfilled' ? statsRes.value.data : undefined;
      const reviews =
        reviewsRes.status === 'fulfilled'
          ? unwrapList<CoreSellerReview>(reviewsRes.value.data)
          : [];

      return {
        data: mapCoreSellerToProfile(sellerRes.value.data, stats, reviews),
        success: true,
      };
    } catch {
      await delay();

      const seller = getSellerProfile(id);
      if (!seller) throw new Error(`Seller not found: ${id}`);

      return { data: seller, success: true };
    }
  },

  /**
   * GET /v1/sellers/:id/products
   * Returns all active listings by this seller.
   */
  getProducts: async (sellerId: string): Promise<ResponseData<Product[]>> => {
    try {
      const res = await axiosClient.get<CoreEnvelope<unknown>>(
        `${BASE}/sellers/${sellerId}/products`,
      ) as unknown as CoreEnvelope<unknown>;

      return {
        data: unwrapList<CoreProduct>(res.data).map(mapCoreProductToAppProduct),
        success: true,
      };
    } catch {
      await delay();

      const products = getSellerProducts(sellerId);
      return { data: products, success: true };
    }
  },
};
