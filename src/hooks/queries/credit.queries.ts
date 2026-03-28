import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService } from '@/services/credit.service';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const creditKeys = {
  all: ['credits'] as const,
  packages: () => [...creditKeys.all, 'packages'] as const,
  history: () => [...creditKeys.all, 'history'] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Fetch available credit packages.
 */
export function useCreditPackages() {
  return useQuery({
    queryKey: creditKeys.packages(),
    queryFn: () => creditService.getPackages(),
    staleTime: 1000 * 60 * 10, // packages rarely change — cache 10 min
  });
}

/**
 * Fetch the user's credit transaction history.
 */
export function useCreditHistory() {
  return useQuery({
    queryKey: creditKeys.history(),
    queryFn: () => creditService.getHistory(),
  });
}

/**
 * Purchase a credit package mutation.
 * Refreshes history on success.
 */
export function usePurchaseCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => creditService.purchase(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.history() });
    },
  });
}
