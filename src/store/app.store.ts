import { mockNotifications } from '@/data/mock-notifications.mock';
import { tokenStorage } from '@/lib/token.storage';
import { authService } from '@/services/auth.service';
import { userProfileToUser, userService } from '@/services/user.service';
import type {
  MembershipBillingCycle,
  MembershipTierId,
  Notification,
  PaidMembershipTierId,
  ProductFilter,
  User,
} from '@/types/app.type';
import type { AuthTokens } from '@/types/auth.types';
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// TODO: re-enable when iOS Client ID is configured
// import { signInWithGoogle, signOutGoogle, statusCodes } from '@/lib/google-auth';

// ─── MMKV Storage Adapter ──────────────────────────────────────────────────
const mmkv = new MMKV();
const mmkvStorage = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => mmkv.delete(key),
};
const storage = createJSONStorage(() => mmkvStorage);

// ─── Credit Store ──────────────────────────────────────────────────────────

interface CreditState {
  balance: number;
  setBalance: (balance: number) => void;
  deductCredit: (amount: number) => boolean;
  addCredit: (amount: number) => void;
}

export const useCreditStore = create<CreditState>()(
  persist(
    (set, get) => ({
      balance: 0,
      setBalance: balance => set({ balance }),
      deductCredit: amount => {
        if (get().balance < amount) return false;
        set(s => ({ balance: s.balance - amount }));
        return true;
      },
      addCredit: amount => set(s => ({ balance: s.balance + amount })),
    }),
    { name: 'modami-credits', storage },
  ),
);

// ─── Auth Store ────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  loginWithTokens: (tokens: AuthTokens) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    name?: string,
  ) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
  updateProfile: (
    patch: Partial<Pick<User, 'name' | 'bio' | 'location' | 'avatar'>>,
  ) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,

      clearAuthError: () => set({ authError: null }),

      loginWithTokens: async tokens => {
        try {
          tokenStorage.save(tokens);
          const profile = await userService.getMyProfile();
          const user: User = {
            ...(userProfileToUser(profile) as User),
            membershipTier: 'curator',
            credits: 0,
          };
          set({ user, isAuthenticated: true });
          return true;
        } catch {
          tokenStorage.clear();
          return false;
        }
      },

      login: async (usernameOrEmail, password) => {
        set({ isLoading: true, authError: null });
        try {
          const tokens = await authService.login(
            usernameOrEmail.trim(),
            password,
          );
          const ok = await get().loginWithTokens(tokens);
          set({ isLoading: false });
          return ok;
        } catch (err: any) {
          set({
            authError: err.message ?? 'Đăng nhập thất bại.',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (username, email, password, name) => {
        set({ isLoading: true, authError: null });
        try {
          await authService.register(
            username.trim(),
            email.trim(),
            password,
            name?.trim(),
          );
          const tokens = await authService.login(username.trim(), password);
          const ok = await get().loginWithTokens(tokens);
          set({ isLoading: false });
          return ok;
        } catch (err: any) {
          set({
            authError: err.message ?? 'Đăng ký thất bại.',
            isLoading: false,
          });
          return false;
        }
      },

      loginWithOAuth: async _provider => {
        // OAuth social login qua Keycloak — cần WebView / deep link
        // Hiện tại chưa hỗ trợ trên mobile, giữ placeholder
        set({ authError: 'Social login chưa được hỗ trợ.' });
      },

      logout: async () => {
        const refreshToken = tokenStorage.getRefreshToken();
        try {
          if (refreshToken) await authService.logout(refreshToken);
        } catch {
          // Silent — vẫn clear local state dù server lỗi
        } finally {
          tokenStorage.clear();
          useCreditStore.getState().setBalance(0);
          set({ user: null, isAuthenticated: false, authError: null });
        }
      },

      updateProfile: patch => {
        set(s => {
          if (!s.user) return s;
          const next: User = { ...s.user, ...patch };
          if (patch.avatar !== undefined) {
            next.avatar = patch.avatar?.trim() || undefined;
          }
          return { user: next };
        });
      },
    }),
    {
      name: 'modami-auth-v2',
      storage,
      partialize: s => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
);

// ─── Product Store ─────────────────────────────────────────────────────────

interface ProductState {
  unlockedProductIds: string[];
  favorites: string[];
  filters: ProductFilter;
  unlockProduct: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  isFavorited: (id: string) => boolean;
  setFilters: (filters: ProductFilter) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      unlockedProductIds: [],
      favorites: [],
      filters: {},
      unlockProduct: id =>
        set(s => ({ unlockedProductIds: [...s.unlockedProductIds, id] })),
      isUnlocked: id => get().unlockedProductIds.includes(id),
      toggleFavorite: id =>
        set(s => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter(f => f !== id)
            : [...s.favorites, id],
        })),
      isFavorited: id => get().favorites.includes(id),
      setFilters: filters => set({ filters }),
      resetFilters: () => set({ filters: {} }),
    }),
    { name: 'modami-products', storage },
  ),
);

// ─── Notification Store (no persist) ──────────────────────────────────────

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>(set => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.isRead).length,
  markRead: id =>
    set(s => {
      const notifications = s.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n,
      );
      return {
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length,
      };
    }),
  markAllRead: () =>
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));

// ─── Membership Store ──────────────────────────────────────────────────────

interface MembershipState {
  tier: MembershipTierId;
  billingCycle: MembershipBillingCycle | null;
  subscribedAt: string | null;
  renewsAt: string | null;
  subscribe: (
    plan: PaidMembershipTierId,
    billing: MembershipBillingCycle,
  ) => void;
  cancelSubscription: () => void;
}

export const useMembershipStore = create<MembershipState>()(
  persist(
    set => ({
      tier: 'curator',
      billingCycle: null,
      subscribedAt: null,
      renewsAt: null,
      subscribe: (plan, billing) => {
        const bonusMap: Record<string, Record<string, number>> = {
          style: { monthly: 100, yearly: 1500 },
          elite: { monthly: 300, yearly: 4000 },
        };
        const bonus = bonusMap[plan]?.[billing] ?? 0;
        if (bonus > 0) useCreditStore.getState().addCredit(bonus);
        const days = billing === 'yearly' ? 365 : 30;
        const renewsAt = new Date(Date.now() + days * 86400000).toISOString();
        set({
          tier: plan,
          billingCycle: billing,
          subscribedAt: new Date().toISOString(),
          renewsAt,
        });
      },
      cancelSubscription: () =>
        set({
          tier: 'curator',
          billingCycle: null,
          subscribedAt: null,
          renewsAt: null,
        }),
    }),
    {
      name: 'modami-membership',
      storage,
      partialize: s => ({
        tier: s.tier,
        billingCycle: s.billingCycle,
        subscribedAt: s.subscribedAt,
        renewsAt: s.renewsAt,
      }),
    },
  ),
);

// ─── App Store (onboarding, global flags) ──────────────────────────────────

interface AppState {
  hasSeenOnboarding: boolean;
  markOnboardingDone: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      hasSeenOnboarding: false,
      markOnboardingDone: () => set({ hasSeenOnboarding: true }),
    }),
    { name: 'modami-app', storage },
  ),
);
