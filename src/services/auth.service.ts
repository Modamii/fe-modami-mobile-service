import { axiosClient, AUTH_URL } from '@/lib/axios';
import type { AuthEnvelope, AuthTokens, RegisterData } from '@/types/auth.types';

const BASE = AUTH_URL;

export const authService = {
  async login(username: string, password: string): Promise<AuthTokens> {
    const res = await axiosClient.post<AuthEnvelope<AuthTokens>>(`${BASE}/auth/login`, { username, password });
    return (res as unknown as AuthEnvelope<AuthTokens>).data;
  },

  async register(
    username: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<RegisterData> {
    const res = await axiosClient.post<AuthEnvelope<RegisterData>>(`${BASE}/auth/register`, {
      username,
      email,
      password,
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
    });
    return (res as unknown as AuthEnvelope<RegisterData>).data;
  },

  async logout(refreshToken: string): Promise<void> {
    await axiosClient.post(`${BASE}/auth/logout`, { refresh_token: refreshToken });
  },

  async sendOtp(email: string, purpose: 'register' | 'forgot-password'): Promise<void> {
    await axiosClient.post(`${BASE}/auth/otp/send`, { email, purpose });
  },

  async verifyOtpRegister(
    email: string,
    otp: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<AuthTokens> {
    const res = await axiosClient.post(`${BASE}/auth/otp/verify`, {
      email, otp, purpose: 'register', username, password,
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
    });
    return res as unknown as AuthTokens;
  },

  async verifyOtp(email: string, otp: string, purpose: 'forgot-password'): Promise<string> {
    const res = await axiosClient.post<{ reset_token: string }>(`${BASE}/auth/otp/verify`, { email, otp, purpose });
    return (res as unknown as { reset_token: string }).reset_token;
  },

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    await axiosClient.post(`${BASE}/auth/reset-password`, { reset_token: resetToken, new_password: newPassword });
  },
};
