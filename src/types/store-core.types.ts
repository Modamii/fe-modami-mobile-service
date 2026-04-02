export interface StoreEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    page_size?: number;
    total?: number;
    total_pages?: number;
  };
}

export type StoreMedia = {
  url?: string;
};

export interface StoreCategory {
  id?: string;
  name?: string;
  name_vi?: string;
  slug?: string;
  icon?: string;
  image?: string;
}

export interface StoreSeller {
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
}

export interface StoreSellerReview {
  id?: string;
  buyer_name?: string;
  rating?: number;
  comment?: string;
  product_title?: string;
}

export interface StoreSellerStats {
  sold_count?: number;
  rating?: number;
  review_count?: number;
}

export interface StoreBlog {
  id?: string;
  title?: string;
  excerpt?: string;
  topic?: string;
  read_time?: string;
  image?: string;
  is_featured?: boolean;
  body?: string;
  author?: string;
  published_at?: string;
  editorial_series?: string;
  author_role?: string;
  author_bio?: string;
  dek?: string;
  tags?: string[];
  word_count?: number;
  reading_level?: 'light' | 'medium' | 'deep';
  cover_caption?: string;
  updated_at?: string;
  key_takeaways?: string[];
  sources?: string[];
}

export interface StoreProduct {
  id?: string;
  slug?: string;
  title?: string;
  price?: number;
  credit_cost?: number;
  images?: Array<StoreMedia | string>;
  condition?: string;
  category_id?: string;
  category?: StoreCategory;
  brand?: string;
  size?: string;
  seller_id?: string;
  seller_name?: string;
  seller?: StoreSeller;
  location?: string;
  description?: string;
  created_at?: string;
  unlock_required?: boolean;
  material?: string;
  color?: string;
  year?: number;
  status?: string;
  submitted_at?: string;
  updated_at?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  hashtags?: string[];
  view_count?: number;
  like_count?: number;
  seller_rating?: number;
  seller_review_count?: number;
  moderation?: {
    reviewed_at?: string;
    reviewer_name?: string;
    reason_category?: string;
    notes?: string;
    suggested_action?: string;
  };
}
