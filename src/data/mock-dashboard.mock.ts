/** Dữ liệu mock bảng điều khiển người bán — khớp cấu trúc dashboard web */

export interface DashboardListingRow {
  id: string;
  title: string;
  price: number;
  image: string;
  views: number;
}

export interface DashboardFeaturedRow {
  id: string;
  title: string;
  badge: 'hot' | 'expired';
}

export interface DashboardContactRow {
  id: string;
  name: string;
  initials: string;
  preview: string;
  accent: string;
}

export interface DashboardCreditRow {
  id: string;
  label: string;
  amount: number;
  dateLabel: string;
}

export const MOCK_DASHBOARD_LISTINGS: DashboardListingRow[] = [
  {
    id: 'dl-1',
    title: 'Đồng hồ Classic Minimalist',
    price: 2_800_000,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&q=80',
    views: 342,
  },
  {
    id: 'dl-2',
    title: 'Áo blazer vintage xanh navy',
    price: 350_000,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80',
    views: 128,
  },
];

export const MOCK_DASHBOARD_FEATURED: DashboardFeaturedRow[] = [
  { id: 'df-1', title: 'Túi xách Vintage 1990s', badge: 'hot' },
  { id: 'df-2', title: 'Giày Sneaker Limited', badge: 'expired' },
];

export const MOCK_DASHBOARD_CONTACTS: DashboardContactRow[] = [
  {
    id: 'dc-1',
    name: 'Hoàng Anh',
    initials: 'H',
    preview: 'Chào chị, em muốn hỏi thêm về size áo…',
    accent: '#274f38',
  },
  {
    id: 'dc-2',
    name: 'Thanh Mai',
    initials: 'T',
    preview: 'Ok ạ, em chuyển khoản trong tối nay nhé.',
    accent: '#5f5e5e',
  },
];

export const MOCK_DASHBOARD_CREDIT_HISTORY: DashboardCreditRow[] = [
  {
    id: 'cr-1',
    label: 'Nạp Credits',
    amount: 100,
    dateLabel: 'Hôm qua · 14:32',
  },
];
