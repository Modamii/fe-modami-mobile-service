import type { NearbyProduct } from '@/types/app.type';

export const mockNearbyProducts: NearbyProduct[] = [
  {
    id: 'nb001',
    title: 'Levis 501 Classic',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=300',
    locationLabel: 'Đại học Bách Khoa',
    sellerName: 'Hương Ly',
    sellerAvatarColor: '#86efac',
    distance: '500m',
  },
  {
    id: 'nb002',
    title: 'White Tote Bag',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300',
    locationLabel: 'Đại học Kinh Tế',
    sellerName: 'Tuấn Anh',
    sellerAvatarColor: '#d1d5db',
    distance: '1.2km',
  },
  {
    id: 'nb003',
    title: 'Oversize Graphic Tee',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    locationLabel: 'Ký túc xá Mễ Trì',
    sellerName: 'Minh Nguyệt',
    sellerAvatarColor: '#fde68a',
    distance: '300m',
  },
];
