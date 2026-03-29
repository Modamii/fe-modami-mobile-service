import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { tokenStorage } from './token.storage';
import type { AuthEnvelope, AuthTokens } from '@/types/auth.types';

// ─── Service base URLs ─────────────────────────────────────────────────────────

export const AUTH_URL =
  'https://modami-auth.techinsightsworld.com/v1/auth-services';
export const USER_URL =
  'https://modami-user.techinsightsworld.com/v1/user-services';

// ─── Unauthorized callback ─────────────────────────────────────────────────────

let _onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  _onUnauthorized = fn;
}

// ─── Single axios instance ─────────────────────────────────────────────────────

export const axiosClient = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Refresh token queue ───────────────────────────────────────────────────────

let isRefreshing = false;
type PendingCallback = (token: string) => void;
let pendingQueue: PendingCallback[] = [];

function processPendingQueue(token: string) {
  pendingQueue.forEach(cb => cb(token));
  pendingQueue = [];
}

async function doRefresh(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await axios.post<AuthEnvelope<AuthTokens>>(
    `${AUTH_URL}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );

  const tokens = res.data.data;
  tokenStorage.save(tokens);
  return tokens.access_token;
}

// ─── Request interceptor — attach Bearer ──────────────────────────────────────

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers.Authorization) {
      const token = tokenStorage.getAccessToken();
      const type = tokenStorage.getTokenType();
      if (token) config.headers.Authorization = `${type} ${token}`;
    }
    return config;
  },
  e => Promise.reject(e),
);

// ─── Response interceptor — unwrap + 401 retry ────────────────────────────────

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async error => {
    const original = error.config;
    const status = error.response?.status;

    if (original?.url?.includes('/auth/refresh')) {
      tokenStorage.clear();
      _onUnauthorized?.();
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register') ||
      original?.url?.includes('/auth/otp');

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise(resolve => {
          pendingQueue.push(token => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const newToken = await doRefresh();
        isRefreshing = false;
        processPendingQueue(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(original);
      } catch {
        isRefreshing = false;
        pendingQueue = [];
        tokenStorage.clear();
        _onUnauthorized?.();
        return Promise.reject(error);
      }
    }

    const apiError = error.response?.data?.error;
    const fieldError = apiError?.errors?.[0]?.message;
    const message =
      fieldError ??
      (typeof apiError === 'string' ? apiError : apiError?.message) ??
      error.response?.data?.message ??
      error.message;
    return Promise.reject(new Error(message));
  },
);
