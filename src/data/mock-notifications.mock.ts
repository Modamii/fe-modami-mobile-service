import type { Notification } from '@/types/app.type';

export const mockNotifications: Notification[] = [
  {
    id: 'n001',
    type: 'like',
    title: 'Thu Hà đã thích sản phẩm của bạn',
    body: 'Áo blazer vintage xanh navy',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'n002',
    type: 'sale',
    title: 'Sản phẩm của bạn đã được mua',
    body: 'Bạn nhận được 80 credits!',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'n003',
    type: 'system',
    title: 'Chào mừng đến với ModaMi',
    body: 'Khám phá thời trang bền vững cùng chúng tôi.',
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];
