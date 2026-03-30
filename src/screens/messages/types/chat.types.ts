export type MessageStatus = 'sent' | 'delivered' | 'read';

export type MessageType =
  | 'text'
  | 'order_confirm'
  | 'order_shipped'
  | 'order_received'
  | 'review_request';

export interface OrderRef {
  orderId: string;
  productTitle: string;
  amount: string;
  address?: string;
  carrier?: string;
  trackingCode?: string;
}

export interface ReviewRef {
  sellerName: string;
  productTitle: string;
  orderId: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
  type?: MessageType;
  productRef?: { id: string; title: string; price: string; image: string };
  orderRef?: OrderRef;
  reviewRef?: ReviewRef;
}
