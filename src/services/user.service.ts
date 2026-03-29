import { axiosClient, USER_URL } from '@/lib/axios';
import type { AuthEnvelope } from '@/types/auth.types';
import type { User } from '@/types/app.type';

const BASE = USER_URL;

export interface UserProfileResponse {
  id: string;
  username?: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other' | 'undisclosed';
  date_of_birth?: string;
  role: 'buyer' | 'seller';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  trust_score: number;
  follower_count: number;
  following_count: number;
  email_verified: boolean;
  created_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other' | 'undisclosed';
  date_of_birth?: string;
}

export function userProfileToUser(profile: UserProfileResponse): Partial<User> {
  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    name: profile.full_name,
    avatar: profile.avatar_url,
    bio: profile.bio,
    phone: profile.phone,
    gender: profile.gender,
    date_of_birth: profile.date_of_birth,
    email_verified: profile.email_verified,
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

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
    const res = await axiosClient.put<AuthEnvelope<UserProfileResponse>>(`${BASE}/users/me`, data);
    return (res as unknown as AuthEnvelope<UserProfileResponse>).data;
  },

  async updateAvatar(avatarUrl: string): Promise<void> {
    await axiosClient.put(`${BASE}/users/me/avatar`, { avatar_url: avatarUrl });
  },

  async updateCover(coverUrl: string): Promise<void> {
    await axiosClient.put(`${BASE}/users/me/cover`, { cover_url: coverUrl });
  },
};
