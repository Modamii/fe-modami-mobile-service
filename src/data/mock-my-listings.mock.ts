import type { MyListing } from '@/types/app.type';

export const mockMyListings: MyListing[] = [
  // ── PENDING ──────────────────────────────────────────────────────────────
  {
    id: 'lst-001',
    title: 'Áo khoác da vintage Zara — form oversize',
    price: 420000,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    ],
    category: 'Outerwear',
    condition: 'good',
    status: 'pending',
    submittedAt: '2026-03-28T10:30:00Z',
    updatedAt: '2026-03-28T10:30:00Z',
  },
  {
    id: 'lst-008',
    title: 'Túi xách da Coach — vintage 2015, màu nâu cognac',
    price: 890000,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    ],
    category: 'Bags',
    condition: 'good',
    status: 'pending',
    submittedAt: '2026-03-27T15:00:00Z',
    updatedAt: '2026-03-27T15:00:00Z',
  },
  {
    id: 'lst-012',
    title: 'Scarf lụa Hermes pattern — authentic, hộp kèm theo',
    price: 2200000,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    ],
    category: 'Accessories',
    condition: 'like-new',
    status: 'pending',
    submittedAt: '2026-03-29T08:00:00Z',
    updatedAt: '2026-03-29T08:00:00Z',
  },

  // ── UNDER REVIEW ─────────────────────────────────────────────────────────
  {
    id: 'lst-002',
    title: "Quần jeans straight leg Levi's 501 — vintage wash",
    price: 350000,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    ],
    category: 'Bottoms',
    condition: 'like-new',
    status: 'under_review',
    submittedAt: '2026-03-26T08:15:00Z',
    updatedAt: '2026-03-27T14:00:00Z',
  },
  {
    id: 'lst-009',
    title: 'Giày Chelsea boot da Zara — size 38, màu đen',
    price: 480000,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400',
    ],
    category: 'Shoes',
    condition: 'good',
    status: 'under_review',
    submittedAt: '2026-03-25T11:00:00Z',
    updatedAt: '2026-03-26T09:30:00Z',
  },

  // ── APPROVED (live on marketplace) ───────────────────────────────────────
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
    productId: 'mm-u001',
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
    productId: 'mm-u002',
  },
  {
    id: 'lst-010',
    title: 'Áo sơ mi linen trắng Uniqlo — size S',
    price: 160000,
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
    ],
    category: 'Tops',
    condition: 'like-new',
    status: 'approved',
    submittedAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-12T14:00:00Z',
    productId: 'mm-u003',
  },

  // ── REJECTED ─────────────────────────────────────────────────────────────
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
        'Mức giá 680.000₫ cao hơn định giá tham chiếu cho giày da Oxford second-hand cùng tình trạng (dao động 350.000–500.000₫). Vui lòng điều chỉnh giá hoặc cung cấp thêm bằng chứng về giá trị.',
      suggestedAction: 'Điều chỉnh giá xuống hoặc thêm ảnh hóa đơn gốc',
    },
  },
  {
    id: 'lst-013',
    title: 'Mũ bucket Carhartt WIP — màu xanh navy',
    price: 220000,
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400',
    ],
    category: 'Accessories',
    condition: 'good',
    status: 'rejected',
    submittedAt: '2026-03-18T10:00:00Z',
    updatedAt: '2026-03-19T14:30:00Z',
    adminFeedback: {
      reviewedAt: '2026-03-19T14:30:00Z',
      reviewerName: 'ModaMi Team',
      reasonCategory: 'Không đủ thông tin sản phẩm',
      notes:
        'Bài đăng thiếu mô tả kích cỡ, tình trạng chi tiết và xuất xứ sản phẩm. ModaMi yêu cầu đầy đủ thông tin để bảo vệ quyền lợi người mua.',
      suggestedAction: 'Bổ sung mô tả, kích cỡ và ảnh tag nhãn sản phẩm',
    },
  },

  // ── SOLD ─────────────────────────────────────────────────────────────────
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
    productId: 'mm-u004',
  },
  {
    id: 'lst-011',
    title: 'Kính mát vintage Rayban Clubmaster — authentic',
    price: 320000,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    ],
    category: 'Accessories',
    condition: 'like-new',
    status: 'sold',
    submittedAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-05T13:00:00Z',
    productId: 'mm-u005',
  },
  {
    id: 'lst-014',
    title: 'Vest linen 2 cúc & quần wide-leg set — form Unisex',
    price: 580000,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4d05?w=400',
    ],
    category: 'Outerwear',
    condition: 'good',
    status: 'sold',
    submittedAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-01-28T11:00:00Z',
    productId: 'mm-u006',
  },
];
