import type { PaidMembershipTierId } from '@/types/app.type';

export interface MembershipPlan {
  id: PaidMembershipTierId;
  label: string;
  price: { monthly: number; yearly: number };
  perks: string[];
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'style',
    label: 'Style',
    price: { monthly: 99000, yearly: 990000 },
    perks: ['50 credits/tháng', 'Ưu tiên hiển thị sản phẩm', 'Huy hiệu Style Curator'],
  },
  {
    id: 'elite',
    label: 'Elite',
    price: { monthly: 249000, yearly: 2490000 },
    perks: ['200 credits/tháng', 'Ưu tiên tìm kiếm', 'Huy hiệu Elite', 'Hỗ trợ ưu tiên'],
  },
];
