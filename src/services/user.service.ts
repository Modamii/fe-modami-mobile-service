import { axiosClient, USER_URL } from '@/lib/axios';
import type { AuthEnvelope } from '@/types/auth.types';
import type { User } from '@/types/app.type';

const BASE = USER_URL;

export interface UserProfileResponse {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other' | 'undisclosed';
  role: 'buyer' | 'seller';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  trust_score: number;
  follower_count: number;
  following_count: number;
  email_verified: boolean;
  created_at: string;
}

export function userProfileToUser(profile: UserProfileResponse): Partial<User> {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    avatar: profile.avatar_url,
    bio: profile.bio,
  };
}

export const userService = {
  async getMyProfile(): Promise<UserProfileResponse> {
    const res = await axiosClient.get<AuthEnvelope<UserProfileResponse>>(`${BASE}/users/me`);
    return (res as unknown as AuthEnvelope<UserProfileResponse>).data;
  },

  async getPublicProfile(userId: string): Promise<UserProfileResponse> {
    const res = await axiosClient.get<AuthEnvelope<UserProfileResponse>>(`${BASE}/users/${userId}`);
    return (res as unknown as AuthEnvelope<UserProfileResponse>).data;
  },
};
