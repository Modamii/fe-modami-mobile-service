export interface CreditPackage {
  id: string;
  credits: number;
  price: string;
  tag: string | null;
}

export interface CreditHistoryItem {
  id: string;
  type: 'earn' | 'spend';
  label: string;
  amount: number;
  date: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'p1', credits: 50, price: '29.000₫', tag: null },
  { id: 'p2', credits: 150, price: '79.000₫', tag: 'Phổ biến' },
  { id: 'p3', credits: 350, price: '159.000₫', tag: 'Tiết kiệm 15%' },
  { id: 'p4', credits: 800, price: '299.000₫', tag: 'Tiết kiệm 25%' },
];

export const MOCK_CREDIT_HISTORY: CreditHistoryItem[] = [
  { id: 'h1', type: 'earn', label: 'Bán thành công · Áo blazer', amount: 50, date: '2 ngày trước' },
  { id: 'h2', type: 'spend', label: 'Xem liên hệ · Túi bucket', amount: -80, date: '3 ngày trước' },
  { id: 'h3', type: 'earn', label: 'Bonus Style Plan · Tháng 3', amount: 100, date: '5 ngày trước' },
  { id: 'h4', type: 'spend', label: 'Xem liên hệ · Quần jeans', amount: -40, date: '1 tuần trước' },
];
