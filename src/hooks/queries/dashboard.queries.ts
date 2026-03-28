import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch seller dashboard summary (listings, featured, contacts, credit history).
 */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardService.getSummary(),
  });
}
