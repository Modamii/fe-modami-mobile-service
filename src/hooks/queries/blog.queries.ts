import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blog.service';
import type { FilterBlogs } from '@/types/api.types';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: FilterBlogs) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch paginated blog/trend list with optional filters.
 */
export function useBlogs(filters?: FilterBlogs) {
  return useQuery({
    queryKey: blogKeys.list(filters ?? {}),
    queryFn: () => blogService.getAll(filters),
  });
}

/**
 * Fetch a single blog post by ID.
 */
export function useBlog(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  });
}
