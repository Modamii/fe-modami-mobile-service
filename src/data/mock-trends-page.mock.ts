import type { TrendSpotlight } from '@/types/app.type';

/** Hero “Quiet Luxury” — đồng bộ với bài t001 */
export const TRENDS_PAGE_HERO = {
  tagline: 'XU HƯỚNG TIÊU ĐIỂM',
  title: 'Quiet Luxury',
  description:
    'Nghệ thuật của sự tinh tế. Khám phá cách phối đồ tối giản nhưng đẳng cấp, định hình phong cách sống hiện đại.',
  image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
  featuredBlogId: 't001' as const,
};

export const TRENDS_FORECAST_LABEL = 'Dự Báo Xu Hướng Tháng 11';
export const TRENDS_FORECAST_SUBTITLE =
  'Phân tích chuyên sâu về những phong cách đang thống trị cộng đồng ModaMi.';

export const TRENDS_WEB_URL = 'https://modami.vercel.app/trends';

export const mockTrendSpotlights: TrendSpotlight[] = [
  {
    id: 's1',
    name: 'Minh Tú',
    role: 'Elite Curator',
    initials: 'MT',
    accentColor: '#274f38',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600',
  },
  {
    id: 's2',
    name: 'Ngọc Huyền',
    role: 'Trend Setter',
    initials: 'NH',
    accentColor: '#5f6b5f',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
  },
  {
    id: 's3',
    name: 'Duy Anh',
    role: 'Eco Curator',
    initials: 'DA',
    accentColor: '#3d5a4a',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
  },
  {
    id: 's4',
    name: 'Khánh Vy',
    role: 'Verified Seller',
    initials: 'KV',
    accentColor: '#6b5f5f',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
  },
];
