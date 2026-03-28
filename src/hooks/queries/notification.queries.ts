import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch all notifications for the current user.
 */
export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: () => notificationService.getAll(),
  });
}

/**
 * Mark a single notification as read.
 * Invalidates the notification list on success.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}

/**
 * Mark all notifications as read.
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}
