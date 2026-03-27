export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  bio?: string;
  location?: string;
  membershipTier: MembershipTierId;
}

export type MembershipTierId = 'curator' | 'style' | 'elite';
export type MembershipBillingCycle = 'monthly' | 'yearly';
export type PaidMembershipTierId = 'style' | 'elite';

export interface Product {
  id: string;
  title: string;
  price: number;
  creditCost: number;
  images: string[];
  condition: ProductCondition;
  category: string;
  brand?: string;
  size?: string;
  sellerId: string;
  sellerName: string;
  location?: string;
  description?: string;
  createdAt: string;
  isUnlockRequired: boolean;
}

export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';

export interface ProductFilter {
  category?: string;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  brand?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'sale' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}
