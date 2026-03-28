import type { ChatMessage } from '@/screens/messages/types/chat.types';
import type { Conversation } from '@/types/app.type';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participantId: 'user-002',
    participantName: 'Thu Hà',
    participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    lastMessage: 'Áo blazer còn không bạn ơi?',
    lastMessageAt: new Date(Date.now() - 15 * 60000).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'conv-002',
    participantId: 'user-003',
    participantName: 'Bảo Châu',
    participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    lastMessage: 'Cảm ơn bạn nhé!',
    lastMessageAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    unreadCount: 0,
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm-001',
    senderId: 'other',
    text: 'Chào bạn! Mình thấy bạn đăng áo blazer xanh navy, áo còn không ạ?',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
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
    text: 'Dạ còn bạn nhé! Áo mình mặc khoảng 2 lần, còn rất mới ạ.',
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-003',
    senderId: 'other',
    text: 'Bạn có thể cho mình xem thêm ảnh thực tế không? Đặc biệt phần cổ áo và tay áo ạ',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-004',
    senderId: 'me',
    text: 'Mình gửi ảnh thêm cho bạn nha. Áo form đẹp lắm, mặc vào rất thanh lịch!',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-005',
    senderId: 'other',
    text: 'Ôi đẹp quá! Mình mặc size M có vừa không bạn nhỉ? Mình cao 1m62, nặng 52kg',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-006',
    senderId: 'me',
    text: 'Áo size M vừa với dáng bạn nha! Mình cùng số đo mặc rất ổn. Bạn thích màu này không?',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-007',
    senderId: 'other',
    text: 'Thích lắm ạ! Bạn có ship về Hà Nội không? Ship phí bao nhiêu ạ?',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    status: 'read',
  },
  {
    id: 'm-008',
    senderId: 'me',
    text: 'Mình ship được ạ! Ship J&T khoảng 30-35k, 2-3 ngày là tới. Bạn muốn đặt không?',
    createdAt: new Date(Date.now() - 7 * 60000).toISOString(),
    status: 'delivered',
  },
  {
    id: 'm-009',
    senderId: 'other',
    text: 'Áo blazer còn không bạn ơi?',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    status: 'read',
  },
];
