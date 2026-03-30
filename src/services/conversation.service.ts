// import { axiosInstance } from '@/lib/axios';
import { mockConversations, MOCK_MESSAGES } from '@/data/mock-conversations.mock';
import type { Conversation } from '@/types/app.type';
import type { ChatMessage, MessageStatus } from '@/screens/messages/types/chat.types';
import type { ResponseData, ResponsePagination } from '@/types/api.types';

/** Simulates network latency. Remove when switching to real API. */
const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface SendMessageRequest {
  conversationId: string;
  text: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const conversationService = {
  /**
   * GET /v1/conversations
   * Returns list of conversations for the current user.
   */
  getAll: async (): Promise<ResponsePagination<Conversation>> => {
    // ── Real API (uncomment when backend is ready) ──────────────────────────
    // return axiosInstance.get('/conversations');
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    return {
      data: mockConversations,
      meta: { page: 1, pageSize: 20, total: mockConversations.length, totalPages: 1 },
      success: true,
    };
  },

  /**
   * GET /v1/conversations/:id/messages
   * Returns all messages in a conversation.
   */
  getMessages: async (conversationId: string): Promise<ResponsePagination<ChatMessage>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.get(`/conversations/${conversationId}/messages`);
    // ───────────────────────────────────────────────────────────────────────

    await delay();

    // In production each conversationId maps to its own message list.
    // For mock we return the same MOCK_MESSAGES for every conversation.
    void conversationId;

    return {
      data: MOCK_MESSAGES,
      meta: { page: 1, pageSize: 50, total: MOCK_MESSAGES.length, totalPages: 1 },
      success: true,
    };
  },

  /**
   * POST /v1/conversations/:id/messages
   * Sends a message and returns the created message object.
   */
  sendMessage: async (req: SendMessageRequest): Promise<ResponseData<ChatMessage>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.post(`/conversations/${req.conversationId}/messages`, {
    //   text: req.text,
    // });
    // ───────────────────────────────────────────────────────────────────────

    await delay(500); // send is faster than fetch

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text: req.text,
      createdAt: new Date().toISOString(),
      status: 'sent' as MessageStatus,
    };

    return { data: newMessage, success: true };
  },

  /**
   * PATCH /v1/conversations/:id/read
   * Marks all messages in a conversation as read.
   */
  markRead: async (conversationId: string): Promise<ResponseData<void>> => {
    // ── Real API ────────────────────────────────────────────────────────────
    // return axiosInstance.patch(`/conversations/${conversationId}/read`);
    // ───────────────────────────────────────────────────────────────────────

    await delay(300);
    void conversationId;

    return { data: undefined, success: true };
  },
};
