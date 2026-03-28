import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import type {
  User,
  ProductFilter,
  Notification,
  MembershipTierId,
  MembershipBillingCycle,
  PaidMembershipTierId,
} from '@/types/app.type';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/constants/app.constants';
import { mockCurrentUser } from '@/data/mock-users.mock';
import { mockNotifications } from '@/data/mock-notifications.mock';
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

const authDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

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
      setBalance: (balance) => set({ balance }),
      deductCredit: (amount) => {
        if (get().balance < amount) return false;
        set((s) => ({ balance: s.balance - amount }));
        return true;
      },
      addCredit: (amount) => set((s) => ({ balance: s.balance + amount })),
    }),
    { name: 'modami-credits', storage },
  ),
);

// ─── Auth Store ────────────────────────────────────────────────────────────

interface RegisteredAccount {
  email: string;
  password: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  accounts: RegisteredAccount[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'bio' | 'location' | 'avatar'>>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,
      accounts: [],
      clearAuthError: () => set({ authError: null }),
      login: async (email, password) => {
        set({ isLoading: true, authError: null });
        await authDelay(450);
        const normalized = email.trim().toLowerCase();
        if (normalized === DEMO_EMAIL && password.trim() === DEMO_PASSWORD) {
          const user = { ...mockCurrentUser, email: normalized };
          set({ user, isAuthenticated: true, isLoading: false });
          useCreditStore.getState().setBalance(user.credits);
          return true;
        }
        const acc = get().accounts.find((a) => a.email === normalized);
        if (!acc || acc.password !== password.trim()) {
          set({ authError: 'Email hoặc mật khẩu không đúng.', isLoading: false });
          return false;
        }
        const user: User = {
          ...mockCurrentUser,
          id: `user-${normalized}`,
          email: normalized,
          name: acc.name,
          credits: 100,
        };
        set({ user, isAuthenticated: true, isLoading: false });
        useCreditStore.getState().setBalance(user.credits);
        return true;
      },
      register: async (email, password, name) => {
        const normalized = email.trim().toLowerCase();
        const passwordTrim = password.trim();
        const displayName =
          name?.trim() ||
          normalized.split('@')[0]?.replace(/[._-]/g, ' ') ||
          'Người dùng';
        if (passwordTrim.length < 8) {
          set({ authError: 'Mật khẩu tối thiểu 8 ký tự.' });
          return false;
        }
        if (normalized === DEMO_EMAIL) {
          set({ authError: 'Email này dành cho tài khoản demo.' });
          return false;
        }
        if (get().accounts.some((a) => a.email === normalized)) {
          set({ authError: 'Email đã được đăng ký.' });
          return false;
        }
        set({ isLoading: true, authError: null });
        await authDelay(450);
        const acc: RegisteredAccount = { email: normalized, password: passwordTrim, name: displayName };
        const user: User = {
          ...mockCurrentUser,
          id: `user-${normalized}`,
          email: normalized,
          name: displayName,
          credits: 100,
        };
        set((s) => ({ accounts: [...s.accounts, acc], user, isAuthenticated: true, isLoading: false }));
        useCreditStore.getState().setBalance(user.credits);
        return true;
      },
      loginWithOAuth: async (provider) => {
        set({ isLoading: true, authError: null });
        await authDelay(500);
        const user: User = {
          ...mockCurrentUser,
          id: `oauth-${provider}-${Date.now()}`,
          name: provider === 'google' ? 'Google Curator' : 'Apple Curator',
          email: provider === 'google' ? 'google.user@modami.app' : 'apple.user@modami.app',
        };
        set({ user, isAuthenticated: true, isLoading: false });
        useCreditStore.getState().setBalance(user.credits);
      },
      logout: () => {
        useCreditStore.getState().setBalance(0);
        set({ user: null, isAuthenticated: false, authError: null });
      },
      updateProfile: (patch) => {
        set((s) => {
          if (!s.user) return s;
          const next: User = { ...s.user, ...patch };
          const trimmedAvatar = patch.avatar?.trim();
          if (patch.avatar !== undefined) {
            next.avatar = trimmedAvatar ? trimmedAvatar : undefined;
          }
          return { user: next };
        });
      },
    }),
    {
      name: 'modami-auth-v2',
      storage,
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated, accounts: s.accounts }),
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
      unlockProduct: (id) =>
        set((s) => ({ unlockedProductIds: [...s.unlockedProductIds, id] })),
      isUnlocked: (id) => get().unlockedProductIds.includes(id),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorited: (id) => get().favorites.includes(id),
      setFilters: (filters) => set({ filters }),
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

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.isRead).length,
  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.isRead).length };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
}));

// ─── Membership Store ──────────────────────────────────────────────────────

interface MembershipState {
  tier: MembershipTierId;
  billingCycle: MembershipBillingCycle | null;
  subscribedAt: string | null;
  renewsAt: string | null;
  subscribe: (plan: PaidMembershipTierId, billing: MembershipBillingCycle) => void;
  cancelSubscription: () => void;
}

export const useMembershipStore = create<MembershipState>()(
  persist(
    (set) => ({
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
        set({ tier: plan, billingCycle: billing, subscribedAt: new Date().toISOString(), renewsAt });
      },
      cancelSubscription: () =>
        set({ tier: 'curator', billingCycle: null, subscribedAt: null, renewsAt: null }),
    }),
    {
      name: 'modami-membership',
      storage,
      partialize: (s) => ({ tier: s.tier, billingCycle: s.billingCycle, subscribedAt: s.subscribedAt, renewsAt: s.renewsAt }),
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
    (set) => ({
      hasSeenOnboarding: false,
      markOnboardingDone: () => set({ hasSeenOnboarding: true }),
    }),
    { name: 'modami-app', storage },
  ),
);
