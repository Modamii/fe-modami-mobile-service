import type { MyListing } from '@/types/app.type';

export const mockMyListings: MyListing[] = [
  {
    id: 'lst-001',
    title: 'Áo khoác da vintage Zara — form oversize',
    price: 420000,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    ],
    category: 'Outerwear',
    condition: 'good',
    status: 'pending',
    submittedAt: '2026-03-28T10:30:00Z',
    updatedAt: '2026-03-28T10:30:00Z',
  },
  {
    id: 'lst-002',
    title: 'Quần jeans straight leg Levi\'s 501',
    price: 350000,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    ],
    category: 'Bottoms',
    condition: 'like-new',
    status: 'under_review',
    submittedAt: '2026-03-26T08:15:00Z',
    updatedAt: '2026-03-27T14:00:00Z',
  },
  {
    id: 'lst-003',
    title: 'Blazer len kẻ sọc H&M — size M',
    price: 280000,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    ],
    category: 'Outerwear',
    condition: 'good',
    status: 'approved',
    submittedAt: '2026-03-20T09:00:00Z',
    updatedAt: '2026-03-22T11:30:00Z',
    productId: 'mm-005',
  },
  {
    id: 'lst-004',
    title: 'Váy midi hoa nhí vintage thập niên 90',
    price: 195000,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    ],
    category: 'Dresses',
    condition: 'good',
    status: 'approved',
    submittedAt: '2026-03-15T14:00:00Z',
    updatedAt: '2026-03-17T10:00:00Z',
    productId: 'mm-012',
  },
  {
    id: 'lst-005',
    title: 'Túi tote canvas thêu tay — handmade',
    price: 150000,
    images: [
      'https://images.unsplash.com/photo-1597633125097-5a9961e1f03d?w=400',
    ],
    category: 'Bags',
    condition: 'new',
    status: 'rejected',
    submittedAt: '2026-03-24T16:45:00Z',
    updatedAt: '2026-03-25T09:20:00Z',
    adminFeedback: {
      reviewedAt: '2026-03-25T09:20:00Z',
      reviewerName: 'ModaMi Team',
      reasonCategory: 'Ảnh không đạt yêu cầu',
      notes:
        'Ảnh sản phẩm bị tối và không rõ chi tiết thêu. Vui lòng chụp lại trong điều kiện ánh sáng tốt, chụp cận cảnh phần thêu tay để người mua có thể đánh giá chất lượng.',
      suggestedAction: 'Chụp lại ảnh và gửi lại bài đăng',
    },
  },
  {
    id: 'lst-006',
    title: 'Giày Oxford da thật Clarks — size 41',
    price: 680000,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    ],
    category: 'Shoes',
    condition: 'good',
    status: 'rejected',
    submittedAt: '2026-03-22T11:00:00Z',
    updatedAt: '2026-03-23T15:40:00Z',
    adminFeedback: {
      reviewedAt: '2026-03-23T15:40:00Z',
      reviewerName: 'ModaMi Team',
      reasonCategory: 'Giá không phù hợp',
      notes:
        'Mức giá 680.000₫ cao hơn định giá tham chiếu của chúng tôi cho giày da Oxford second-hand cùng tình trạng (dao động 350.000–500.000₫). Vui lòng điều chỉnh giá hoặc cung cấp thêm bằng chứng về giá trị (hóa đơn gốc, certificate...).',
      suggestedAction: 'Điều chỉnh giá xuống hoặc thêm ảnh hóa đơn gốc',
    },
  },
  {
    id: 'lst-007',
    title: 'Áo len cổ lọ Uniqlo — màu kem',
    price: 220000,
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400',
    ],
    category: 'Tops',
    condition: 'like-new',
    status: 'sold',
    submittedAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-03-01T17:00:00Z',
    productId: 'mm-008',
  },
];
