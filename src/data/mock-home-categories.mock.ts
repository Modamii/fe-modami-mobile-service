import type { HomeCategory } from '@/types/app.type';

export const mockHomeCategories: HomeCategory[] = [
  {
    id: 'cat-ao',
    label: 'Áo',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Tops',
  },
  {
    id: 'cat-vay',
    label: 'Váy',
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400',
    category: 'Dresses',
  },
  {
    id: 'cat-giay',
    label: 'Giày',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Shoes',
  },
  {
    id: 'cat-phukien',
    label: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400',
    category: 'Accessories',
  },
];
