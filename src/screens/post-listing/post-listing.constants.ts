export const CONDITION_LABELS: Record<string, string> = {
  new: 'Mới — chưa dùng, còn tag',
  'like-new': 'Như mới — dùng 1-2 lần',
  good: 'Tốt — dùng vài lần, không lỗi',
  fair: 'Khá tốt — có dấu hiệu dùng nhỏ',
};

export const CONDITION_NAMES: Record<string, string> = {
  new: 'Mới',
  'like-new': 'Như mới',
  good: 'Tốt',
  fair: 'Khá tốt',
};

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Khác'] as const;
