import { useQuery } from '@tanstack/react-query';
import { homeService } from '@/services/home.service';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const homeKeys = {
  all: ['home'] as const,
  data: () => [...homeKeys.all, 'data'] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch all home screen sections in a single request.
 *
 * staleTime: Infinity — data is never considered stale, so React Query will
 * not trigger a background refetch when the user navigates back to the home
 * tab. The skeleton only appears on the very first load within a session.
 * Pull-to-refresh still works via explicit refetch().
 */
export function useHomeData() {
  return useQuery({
    queryKey: homeKeys.data(),
    queryFn: homeService.getHomeData,
    staleTime: Infinity,
  });
}
