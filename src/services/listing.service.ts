import { mockMyListings } from '@/data/mock-my-listings.mock';
import type { MyListing, ListingStatus } from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';

const delay = (ms = 800) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const listingService = {
  async getMyListings(): Promise<ResponseData<MyListing[]>> {
    await delay();
    return { data: mockMyListings };
  },

  async getListingById(id: string): Promise<ResponseData<MyListing>> {
    await delay(500);
    const listing = mockMyListings.find((l) => l.id === id);
    if (!listing) throw new Error('Không tìm thấy bài đăng');
    return { data: listing };
  },

  async getListingsByStatus(status: ListingStatus): Promise<ResponseData<MyListing[]>> {
    await delay();
    return { data: mockMyListings.filter((l) => l.status === status) };
  },
};
