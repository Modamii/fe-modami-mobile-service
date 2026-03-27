import type { SellerProfile, SellerReview } from '@/types/app.type';
import { mockProducts } from '@/data/mock-products.mock';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80';

function slugify(name: string): string {
  const ascii = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return ascii.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function makeReviews(sellerId: string, seed: string): SellerReview[] {
  return [
    {
      id: `${sellerId}-r1`,
      buyerName: 'Hương Nguyễn',
      buyerInitial: 'H',
      rating: 5,
      comment:
        '“Đóng gói cẩn thận, mô tả đúng ảnh. Sẽ quay lại shop nhiều lần nữa.”',
      boughtProductTitle: seed,
    },
    {
      id: `${sellerId}-r2`,
      buyerName: 'Trần Minh',
      buyerInitial: 'T',
      rating: 5,
      comment: '“Giao nhanh, phản hồi tin nhắn rất lịch sự. Recommend!”',
      boughtProductTitle: 'Sản phẩm tại ModaMi',
    },
  ];
}

export const MOCK_SELLER_PROFILES: Record<string, SellerProfile> = {
  'user-002': {
    id: 'user-002',
    displayName: 'Thu Hà',
    username: '@thu_ha_curator',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    coverImageUrl: DEFAULT_COVER,
    bio:
      'Curator tập trung đồ consignment và secondhand từ các thương hiệu bền vững. Cam kết mô tả trung thực, ảnh chụp dưới ánh sáng tự nhiên.',
    location: 'Quận Ba Đình, Hà Nội',
    joinedAtLabel: 'Tham gia từ T8, 2022',
    soldCount: 84,
    isVerified: true,
    rating: 4.9,
    reviewCount: 128,
    reviews: makeReviews('user-002', 'Áo blazer vintage'),
  },
  'user-003': {
    id: 'user-003',
    displayName: 'Bảo Châu',
    username: '@bao_chau_bags',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    coverImageUrl:
      'https://images.unsplash.com/photo-1567401893416-63616588d862?w=1200&q=80',
    bio: 'Chuyên túi xách và phụ kiện authentic — kiểm tra chi tiết khóa, tem và đường chỉ trước khi đăng.',
    location: 'Quận 1, TP. Hồ Chí Minh',
    joinedAtLabel: 'Tham gia từ T4, 2023',
    soldCount: 56,
    isVerified: true,
    rating: 4.7,
    reviewCount: 52,
    reviews: makeReviews('user-003', 'Túi bucket da'),
  },
  'user-004': {
    id: 'user-004',
    displayName: 'Minh Khoa',
    username: '@minhkhoa_style',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    coverImageUrl:
      'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80',
    bio: 'Tuyển đồ nam — sneaker, áo khoác và quần tây secondhand chất lượng tốt.',
    location: 'Cầu Giấy, Hà Nội',
    joinedAtLabel: 'Tham gia từ T1, 2023',
    soldCount: 41,
    isVerified: true,
    rating: 4.8,
    reviewCount: 33,
    reviews: makeReviews('user-004', 'Áo khoác'),
  },
  'user-005': {
    id: 'user-005',
    displayName: 'Lan Anh',
    username: '@lananh_vintage',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    coverImageUrl:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80',
    bio: 'Vintage & đầm dạo phố — chọn lọc form và chất liệu phù hợp khí hậu miền Nam.',
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    joinedAtLabel: 'Tham gia từ T6, 2022',
    soldCount: 72,
    isVerified: true,
    rating: 4.85,
    reviewCount: 64,
    reviews: makeReviews('user-005', 'Đầm lụa'),
  },
  'user-006': {
    id: 'user-006',
    displayName: 'Ngọc Mai',
    username: '@ngocmai_closet',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    coverImageUrl: DEFAULT_COVER,
    bio: 'Tủ đồ nữ công sở & casual — ưu tiên màu trung tính, dễ phối.',
    location: 'Hải Châu, Đà Nẵng',
    joinedAtLabel: 'Tham gia từ T8, 2023',
    soldCount: 29,
    isVerified: false,
    rating: 4.6,
    reviewCount: 18,
    reviews: makeReviews('user-006', 'Sơ mi nữ'),
  },
  'user-007': {
    id: 'user-007',
    displayName: 'Phương Linh',
    username: '@phuonglinh_luxe',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    coverImageUrl:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
    bio: 'Luxury pre-loved — giày và phụ kiện nhỏ, có giấy tờ khi có.',
    location: 'Quận 3, TP. Hồ Chí Minh',
    joinedAtLabel: 'Tham gia từ T2, 2024',
    soldCount: 38,
    isVerified: true,
    rating: 4.95,
    reviewCount: 44,
    reviews: makeReviews('user-007', 'Giày cao gót'),
  },
  'user-minh-tuan': {
    id: 'user-minh-tuan',
    displayName: 'Minh Tuấn',
    username: '@minh_tuan',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    coverImageUrl:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
    bio: 'Đồ nam basic & unisex — giao dịch nhanh, gói hàng gọn.',
    location: 'Nam Từ Liêm, Hà Nội',
    joinedAtLabel: 'Tham gia từ T11, 2023',
    soldCount: 62,
    isVerified: true,
    rating: 4.75,
    reviewCount: 40,
    reviews: makeReviews('user-minh-tuan', 'Quần jeans'),
  },
};

export function getSellerProducts(sellerId: string) {
  return mockProducts.filter((p) => p.sellerId === sellerId);
}

export function getSellerProfile(sellerId: string): SellerProfile | null {
  const product = mockProducts.find((p) => p.sellerId === sellerId);
  if (!product) return null;

  const rich = MOCK_SELLER_PROFILES[sellerId];
  if (rich) {
    return {
      ...rich,
      rating: product.sellerRating ?? rich.rating,
      reviewCount: product.sellerReviewCount ?? rich.reviewCount,
    };
  }

  const count = getSellerProducts(sellerId).length;
  return {
    id: sellerId,
    displayName: product.sellerName,
    username: `@${slugify(product.sellerName)}`,
    avatarUrl: undefined,
    coverImageUrl: DEFAULT_COVER,
    bio: `Shop thời trang secondhand của ${product.sellerName} trên ModaMi.`,
    location: product.location ?? 'Việt Nam',
    joinedAtLabel: 'Tham gia ModaMi',
    soldCount: Math.min(200, Math.max(count * 12, count + 12)),
    isVerified: product.isVerified ?? false,
    rating: product.sellerRating ?? 4.8,
    reviewCount: product.sellerReviewCount ?? 12,
    reviews: makeReviews(sellerId, product.title),
  };
}
