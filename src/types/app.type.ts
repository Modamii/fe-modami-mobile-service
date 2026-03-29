export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  bio?: string;
  location?: string;
  membershipTier: MembershipTierId;
}

export type MembershipTierId = 'curator' | 'style' | 'elite';
export type MembershipBillingCycle = 'monthly' | 'yearly';
export type PaidMembershipTierId = 'style' | 'elite';

export interface Product {
  id: string;
  title: string;
  slug?: string;
  price: number;
  creditCost: number;
  images: string[];
  condition: ProductCondition;
  category: string;
  brand?: string;
  size?: string;
  sellerId: string;
  sellerName: string;
  location?: string;
  description?: string;
  createdAt: string;
  isUnlockRequired: boolean;
  /** Chất liệu, ví dụ: Da cừu 100% */
  material?: string;
  /** Màu sắc hiển thị */
  color?: string;
  /** Năm sản xuất / mua */
  year?: number;
  /** Badge nổi bật trên listing */
  isFeatured?: boolean;
  /** Đã xác thực người bán / sản phẩm */
  isVerified?: boolean;
  /** Khối “Câu chuyện vật phẩm” */
  story?: string;
  /** Hashtag hiển thị dưới stats */
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  sellerRating?: number;
  sellerReviewCount?: number;
  /** Mã hiển thị (SKU / tham chiếu ModaMi) */
  referenceCode?: string;
  /** Dáng: Regular, Oversize, Slim… */
  fit?: string;
  /** Xuất xứ / nơi sản xuất */
  origin?: string;
  /** Kích thước đóng gói hoặc số đo (ngực × dài…) */
  dimensions?: string;
  /** Giới tính gợi ý: Nam / Nữ / Unisex */
  gender?: string;
  /** Mùa / occasion gợi ý */
  season?: string;
  /** Giặt & bảo quản */
  careInstructions?: string;
  /** Ghi chú giao hàng (khu vực, thời gian) */
  shippingNotes?: string;
  /** Tem / chứng thực / nguồn gốc */
  authenticityNote?: string;
}

export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';

export type ListingStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'sold';

export interface AdminFeedback {
  reviewedAt: string;
  reviewerName: string;
  reasonCategory: string;
  notes: string;
  suggestedAction?: string;
}

export interface MyListing {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  condition: ProductCondition;
  status: ListingStatus;
  submittedAt: string;
  updatedAt: string;
  productId?: string;
  adminFeedback?: AdminFeedback;
}

export interface ProductFilter {
  category?: string;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  brand?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'sale' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface HomeCategory {
  id: string;
  label: string;
  image: string;
  category: string;
}

export interface NearbyProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  locationLabel: string;
  sellerName: string;
  sellerAvatarColor: string;
  distance: string;
}

export type TrendReadingLevel = 'light' | 'medium' | 'deep';

export interface TrendBlog {
  id: string;
  title: string;
  excerpt: string;
  topic: string;
  readTime: string;
  image: string;
  isFeatured?: boolean;
  /** Nội dung chi tiết (đoạn cách nhau bằng \n\n) */
  body: string;
  author?: string;
  publishedAt?: string;
  /** Chuỗi dòng sách báo: ví dụ ModaMi Insight · Q4/2025 */
  editorialSeries?: string;
  /** Chức danh tác giả */
  authorRole?: string;
  /** Một dòng giới thiệu tác giả */
  authorBio?: string;
  /** Phụ đề dưới tiêu đề (dek) */
  dek?: string;
  tags?: string[];
  /** Ước lượng độ dài nội dung */
  wordCount?: number;
  readingLevel?: TrendReadingLevel;
  /** Ghi chú ảnh bìa */
  coverCaption?: string;
  /** Cập nhật lần cuối (ISO date) */
  updatedAt?: string;
  /** 3–5 ý chính (bullet) */
  keyTakeaways?: string[];
  /** Tham khảo / nguồn (tùy chọn) */
  sources?: string[];
}

export interface TrendSpotlight {
  id: string;
  name: string;
  role: string;
  initials: string;
  accentColor: string;
  image: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface SellerReview {
  id: string;
  buyerName: string;
  buyerInitial: string;
  rating: number;
  comment: string;
  boughtProductTitle: string;
}

export interface SellerProfile {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  coverImageUrl: string;
  bio: string;
  location: string;
  joinedAtLabel: string;
  soldCount: number;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  reviews: SellerReview[];
}
