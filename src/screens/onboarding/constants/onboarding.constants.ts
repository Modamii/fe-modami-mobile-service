import { Platform } from 'react-native';
import { COLORS } from '@/constants/app.constants';

// ─── Slide types ─────────────────────────────────────────────────────────────

export type SlideId = 'discover' | 'trust' | 'credit' | 'impact';

export interface Slide {
  id: SlideId;
  title: string;
  body: string;
  ctaLabel: string;
  ctaArrow?: boolean;
}

// ─── Slide data ───────────────────────────────────────────────────────────────

export const SLIDES: Slide[] = [
  {
    id: 'discover',
    title: 'Khám phá Kho Báu',
    body: 'Thế giới đồ hiệu và vintage tuyển chọn, mở ra phong cách riêng cho bạn.',
    ctaLabel: 'Tiếp tục',
  },
  {
    id: 'trust',
    title: 'Giao dịch Tin Cậy',
    body: 'Hệ thống eKYC hiện đại cùng huy hiệu Người bán uy tín giúp bạn an tâm mua sắm.',
    ctaLabel: 'Tiếp tục',
  },
  {
    id: 'credit',
    title: 'M-Credit Tiện Lợi',
    body: '1 Credit',
    ctaLabel: 'Tiếp tục',
    ctaArrow: true,
  },
  {
    id: 'impact',
    title: 'Lan Tỏa Tác Động',
    body: 'Mỗi món đồ trao đổi là một hành động bảo vệ môi trường. Cùng ModaMi xây dựng cộng đồng bền vững.',
    ctaLabel: 'Bắt đầu ngay',
  },
];

// ─── Shadow helpers (platform-specific, cannot be Tailwind) ──────────────────

export const cardShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24 },
  android: { elevation: 4 },
});

export const badgeShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
  android: { elevation: 2 },
});

export const formShadow = Platform.select({
  ios: { shadowColor: COLORS.onSurface, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  android: { elevation: 1 },
});

export const creditCardShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24 },
  android: { elevation: 8 },
});

export const ctaShadow = Platform.select({
  ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 16 },
  android: { elevation: 4 },
});
