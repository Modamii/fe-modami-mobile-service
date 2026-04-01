export const DEMO_EMAIL = 'demo@modami.app';
export const DEMO_PASSWORD = 'demo1234';
export const PRIVACY_POLICY_URL = 'https://modami.vercel.app/privacy-policy';
export const TERMS_OF_SERVICE_URL = 'https://modami.vercel.app/terms-of-service';

export const COLORS = {
  primary: '#274f38',
  primaryContainer: '#3f674f',
  secondary: '#5f5e5e',
  background: '#f9f9f8',
  surface: '#ffffff',
  surfaceLow: '#f3f4f3',
  surfaceContainer: '#edeeed',
  surfaceHigh: '#e7e8e7',
  surfaceHighest: '#e1e3e2',
  onSurface: '#191c1c',
  onPrimary: '#ffffff',
  outlineVariant: '#c1c8c1',
} as const;

export const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Bags',
  'Accessories',
] as const;

export const CONDITIONS = ['new', 'like-new', 'good', 'fair'] as const;

export const MEMBERSHIP_TIERS = {
  curator: { label: 'Curator', color: '#5f5e5e' },
  style: { label: 'Style', color: '#274f38' },
  elite: { label: 'Elite', color: '#d4af37' },
} as const;
