import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  conversationService,
  type SendMessageRequest,
} from '@/services/conversation.service';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  messages: (id: string) => [...conversationKeys.all, 'messages', id] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch the list of conversations for the current user.
 * Returns isLoading, isRefetching, refetch (for pull-to-refresh), and data.
 */
export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.lists(),
    queryFn: () => conversationService.getAll(),
  });
}

/**
 * Fetch all messages inside a specific conversation.
 */
export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => conversationService.getMessages(conversationId),
    enabled: !!conversationId,
    // Poll every 10 s to simulate real-time updates until WebSocket is ready
    refetchInterval: 10_000,
  });
}

/**
 * Send a message mutation.
 * On success, invalidates the messages query so the list refreshes.
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: SendMessageRequest) => conversationService.sendMessage(req),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(variables.conversationId),
      });
      // Also refresh conversation list so lastMessage updates
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

/**
 * Mark all messages in a conversation as read.
 */
export function useMarkConversationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => conversationService.markRead(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
