import axios from 'axios';

const BASE_URL = 'https://api.modami.app/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor — attach auth token ──────────────────────────────────

axiosInstance.interceptors.request.use(
  (config) => {
    // TODO: Lấy token từ MMKV store khi có real auth
    // const token = storage.getString('auth-token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — normalize errors ─────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;

    if (status === 401) {
      // TODO: dispatch logout khi tích hợp auth thật
      console.warn('[API] 401 Unauthorized — token expired or invalid');
    }

    return Promise.reject(new Error(Array.isArray(message) ? message[0] : message));
  },
);
