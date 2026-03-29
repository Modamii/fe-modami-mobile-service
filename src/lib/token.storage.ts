import { MMKV } from 'react-native-mmkv';
import type { AuthTokens } from '@/types/auth.types';

const storage = new MMKV({ id: 'modami-tokens' });

const KEY = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_TYPE: 'token_type',
  EXPIRES_AT: 'expires_at',
} as const;

export const tokenStorage = {
  save({ access_token, refresh_token, expires_in, token_type }: AuthTokens) {
    storage.set(KEY.ACCESS_TOKEN, access_token);
    storage.set(KEY.REFRESH_TOKEN, refresh_token);
    storage.set(KEY.TOKEN_TYPE, token_type);
    storage.set(KEY.EXPIRES_AT, String(Date.now() + expires_in * 1000));
  },

  getAccessToken: (): string | null => storage.getString(KEY.ACCESS_TOKEN) ?? null,
  getRefreshToken: (): string | null => storage.getString(KEY.REFRESH_TOKEN) ?? null,
  getTokenType: (): string => storage.getString(KEY.TOKEN_TYPE) ?? 'Bearer',

  clear() {
    storage.delete(KEY.ACCESS_TOKEN);
    storage.delete(KEY.REFRESH_TOKEN);
    storage.delete(KEY.TOKEN_TYPE);
    storage.delete(KEY.EXPIRES_AT);
  },
};
