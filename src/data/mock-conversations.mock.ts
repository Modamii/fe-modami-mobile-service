import type { ChatMessage } from '@/screens/messages/types/chat.types';
import type { Conversation } from '@/types/app.type';

// ─── Conversation list ────────────────────────────────────────────────────────

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participantId: 'user-002',
    participantName: 'Thu Hà',
    participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    lastMessage: 'Bạn nhớ để lại đánh giá nhé! ⭐',
    lastMessageAt: new Date(Date.now() - 10 * 60000).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'conv-002',
    participantId: 'user-003',
    participantName: 'Bảo Châu',
    participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    lastMessage: 'J&T đang trên đường giao, bạn để ý điện thoại nha!',
    lastMessageAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'conv-003',
    participantId: 'user-004',
    participantName: 'Minh Tuấn',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    lastMessage: 'Áo có thể giảm thêm chút không bạn? 250k được không?',
    lastMessageAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'conv-004',
    participantId: 'user-005',
    participantName: 'Linh Chi',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'Cảm ơn bạn nhiều nhé, mình rất thích sản phẩm!',
    lastMessageAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    unreadCount: 0,
  },
];

// ─── Full purchase journey: Thu Hà mua áo blazer ─────────────────────────────
// Timeline: hỏi hàng → thương lượng → chốt đơn → giao hàng → nhận hàng → đánh giá

export const MOCK_MESSAGES: ChatMessage[] = [
  // ── Ngày hôm qua: Hỏi hàng & thương lượng ─────────────────────────────────
  {
    id: 'm-001',
    senderId: 'other',
    type: 'text',
    text: 'Chào bạn! Mình thấy bạn đăng áo blazer xanh navy, còn hàng không ạ?',
    createdAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    status: 'read',
    productRef: {
      id: 'p001',
      title: 'Áo blazer vintage xanh navy',
      price: '350.000₫',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
    },
  },
  {
    id: 'm-002',
    senderId: 'me',
    type: 'text',
    text: 'Dạ còn bạn nhé! Áo mình mặc khoảng 2 lần thôi, vải còn rất tốt.',
    createdAt: new Date(Date.now() - 25 * 3600000 - 50 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-003',
    senderId: 'other',
    type: 'text',
    text: 'Bạn có thể cho mình xem ảnh thực tế không? Đặc biệt phần cổ và tay áo ạ.',
    createdAt: new Date(Date.now() - 25 * 3600000 - 30 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-004',
    senderId: 'me',
    type: 'text',
    text: 'Mình gửi ảnh thêm cho bạn nha. Áo form oversized nhẹ, mặc rất thanh lịch bạn ơi!',
    createdAt: new Date(Date.now() - 25 * 3600000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-005',
    senderId: 'other',
    type: 'text',
    text: 'Ôi đẹp quá! Mình mặc size M có vừa không ạ? Mình cao 1m62, nặng 52kg.',
    createdAt: new Date(Date.now() - 24 * 3600000 - 40 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-006',
    senderId: 'me',
    type: 'text',
    text: 'Size M vừa với dáng bạn nha! Mình cùng số đo mặc rất ổn, ảnh mình mặc bạn thấy trên listing đó.',
    createdAt: new Date(Date.now() - 24 * 3600000 - 20 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-007',
    senderId: 'other',
    type: 'text',
    text: 'Bạn có thể bớt xuống 300k không? Mình mua liền nha.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-008',
    senderId: 'me',
    type: 'text',
    text: 'Áo này mình mua 700k bạn ơi 😅 Mình bớt tới 320k là cố lắm rồi, bao ship J&T luôn nhé!',
    createdAt: new Date(Date.now() - 23 * 3600000 - 50 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-009',
    senderId: 'other',
    type: 'text',
    text: 'Oke bạn! Deal 320k bao ship nha. Mình chuyển khoản trước hay COD?',
    createdAt: new Date(Date.now() - 23 * 3600000 - 30 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-010',
    senderId: 'me',
    type: 'text',
    text: 'Mình nhận chuyển khoản trước bạn nhé, tiện hơn. Bạn cho mình địa chỉ nhận hàng đầy đủ nha.',
    createdAt: new Date(Date.now() - 23 * 3600000 - 10 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-011',
    senderId: 'other',
    type: 'text',
    text: 'Nguyễn Thu Hà - 0912 345 678\n47 Trần Hưng Đạo, P. Cửa Nam, Q. Hoàn Kiếm, Hà Nội.',
    createdAt: new Date(Date.now() - 23 * 3600000).toISOString(),
    status: 'read',
  },

  // ── Xác nhận đặt hàng (system card) ───────────────────────────────────────
  {
    id: 'm-012',
    senderId: 'system',
    type: 'order_confirm',
    text: '',
    createdAt: new Date(Date.now() - 22 * 3600000 - 30 * 60000).toISOString(),
    status: 'read',
    orderRef: {
      orderId: 'MDM-20847',
      productTitle: 'Áo blazer vintage xanh navy',
      amount: '320.000₫',
      address: '47 Trần Hưng Đạo, P. Cửa Nam, Q. Hoàn Kiếm, Hà Nội',
    },
  },
  {
    id: 'm-013',
    senderId: 'me',
    type: 'text',
    text: 'Mình đã xác nhận đơn hàng. Bạn chuyển khoản vào: Vietinbank - 105870820196 - DAO VAN THUONG. Nội dung: MDM-20847.',
    createdAt: new Date(Date.now() - 22 * 3600000 - 20 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-014',
    senderId: 'other',
    type: 'text',
    text: 'Mình đã chuyển khoản rồi bạn ơi! Bạn kiểm tra xem có nhận được chưa nhé 🙏',
    createdAt: new Date(Date.now() - 22 * 3600000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-015',
    senderId: 'me',
    type: 'text',
    text: 'Mình nhận được rồi bạn nhé! Mình sẽ đóng gói cẩn thận và gửi hàng ngay hôm nay 🎉',
    createdAt: new Date(Date.now() - 21 * 3600000 - 40 * 60000).toISOString(),
    status: 'read',
  },

  // ── Giao hàng (system card) ────────────────────────────────────────────────
  {
    id: 'm-016',
    senderId: 'system',
    type: 'order_shipped',
    text: '',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    status: 'read',
    orderRef: {
      orderId: 'MDM-20847',
      productTitle: 'Áo blazer vintage xanh navy',
      amount: '320.000₫',
      carrier: 'J&T Express',
      trackingCode: 'JT2025031500842',
    },
  },
  {
    id: 'm-017',
    senderId: 'me',
    type: 'text',
    text: 'J&T đang trên đường giao, bạn để ý điện thoại nha! Dự kiến ngày mai là tới.',
    createdAt: new Date(Date.now() - 7 * 3600000 - 50 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-018',
    senderId: 'other',
    type: 'text',
    text: 'Cảm ơn bạn nhiều nhé! Mình trông mong lắm rồi 😍',
    createdAt: new Date(Date.now() - 7 * 3600000 - 30 * 60000).toISOString(),
    status: 'read',
  },

  // ── Nhận hàng thành công (system card) ────────────────────────────────────
  {
    id: 'm-019',
    senderId: 'system',
    type: 'order_received',
    text: '',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    status: 'read',
    orderRef: {
      orderId: 'MDM-20847',
      productTitle: 'Áo blazer vintage xanh navy',
      amount: '320.000₫',
    },
  },
  {
    id: 'm-020',
    senderId: 'other',
    type: 'text',
    text: 'Mình nhận hàng rồi bạn ơi! Áo đẹp hơn mình nghĩ, đóng gói cũng rất cẩn thận. Cảm ơn bạn nhiều lắm! 🥰',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-021',
    senderId: 'me',
    type: 'text',
    text: 'Aw cảm ơn bạn đã tin tưởng mình nha! Bạn mặc đẹp lắm chắc chắn rồi 🌿',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    status: 'read',
  },

  // ── Yêu cầu đánh giá (system card) ────────────────────────────────────────
  {
    id: 'm-022',
    senderId: 'system',
    type: 'review_request',
    text: '',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'read',
    reviewRef: {
      sellerName: 'Văn Thương',
      productTitle: 'Áo blazer vintage xanh navy',
      orderId: 'MDM-20847',
    },
  },
  {
    id: 'm-023',
    senderId: 'other',
    type: 'text',
    text: 'Bạn nhớ để lại đánh giá nhé! ⭐',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    status: 'read',
  },
];
