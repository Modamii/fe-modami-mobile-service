import { mockMyListings } from '@/data/mock-my-listings.mock';
import type {
  MyListing,
  ListingStatus,
  ProductCondition,
} from '@/types/app.type';
import type { ResponseData } from '@/types/api.types';

const delay = (ms = 300) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export interface SubmitListingPayload {
  title: string;
  price: number;
  images: string[];
  category: string;
  condition: ProductCondition;
  brand?: string;
  description?: string;
  size?: string;
}

export const listingService = {
  async getMyListings(): Promise<ResponseData<MyListing[]>> {
    await delay();
    return { data: mockMyListings, success: true };
  },

  async getListingById(id: string): Promise<ResponseData<MyListing>> {
    await delay(500);
    const listing = mockMyListings.find(l => l.id === id);
    if (!listing) throw new Error('Không tìm thấy bài đăng');
    return { data: listing, success: true };
  },

  async getListingsByStatus(
    status: ListingStatus,
  ): Promise<ResponseData<MyListing[]>> {
    await delay();
    return {
      data: mockMyListings.filter(l => l.status === status),
      success: true,
    };
  },

  async submitListing(
    payload: SubmitListingPayload,
  ): Promise<ResponseData<MyListing>> {
    await delay(1200);
    const now = new Date().toISOString();
    const newListing: MyListing = {
      id: `lst-${Date.now()}`,
      title: payload.title,
      price: payload.price,
      images:
        payload.images.length > 0
          ? payload.images
          : [
              'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
            ],
      category: payload.category,
      condition: payload.condition,
      status: 'pending',
      submittedAt: now,
      updatedAt: now,
    };
    mockMyListings.unshift(newListing);
    return { data: newListing, success: true };
  },
};
