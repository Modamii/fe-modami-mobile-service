import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listingService } from '@/services/listing.service';
import type { MyListing } from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';

export const listingKeys = {
  all: ['listings'] as const,
  mine: () => [...listingKeys.all, 'mine'] as const,
  detail: (id: string) => [...listingKeys.all, 'detail', id] as const,
};

export function useMyListings() {
  return useQuery({
    queryKey: listingKeys.mine(),
    queryFn: () => listingService.getMyListings(),
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => listingService.getListingById(id),
    enabled: !!id,
  });
}

/** Seed listing detail cache from list — call before navigating */
export function useSeedListingCache() {
  const queryClient = useQueryClient();
  return (listing: MyListing) => {
    queryClient.setQueryData<ResponseData<MyListing>>(
      listingKeys.detail(listing.id),
      { data: listing, success: true },
    );
  };
}
