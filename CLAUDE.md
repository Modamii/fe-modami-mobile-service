# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ModaMi Mobile — React Native 0.84 (bare, no Expo) storefront app for a Vietnamese re-commerce (secondhand fashion) platform. Features: product browsing, credit-based unlocking, multi-tier membership, messaging, and PWA-like offline capability.

## Commands

```bash
npm start                    # Start Metro bundler
npm start -- --reset-cache   # Reset Metro cache (required after config changes)
npm run android              # Run on Android emulator/device
npm run ios                  # Run on iOS simulator (macOS + Xcode required)
npm run lint                 # ESLint
npm test                     # Jest unit tests
```

**First iOS run:** `cd ios && pod install` before `npm run ios`.

## Architecture

```
src/
├── screens/              # One folder per feature
│   ├── auth/             # Login, Register
│   ├── home/             # Feed screen
│   ├── explore/          # Search + filter + grid
│   ├── messages/         # Conversation list
│   ├── notifications/    # Notification list
│   ├── post-listing/     # Sell form
│   └── profile/          # Profile, Credits, Membership
├── components/
│   ├── ui/               # Base primitives: Button, Input, AppText, Card
│   ├── atoms/            # TabBarIcon (lucide wrapper)
│   └── molecules/        # CreditChip, ProductCard
├── navigation/
│   ├── types.ts          # All typed param lists + RootStackScreenProps helpers
│   ├── RootNavigator.tsx # Auth vs Main split (driven by useAuthStore)
│   ├── AuthNavigator.tsx # Stack: Login → Register
│   └── MainTabNavigator.tsx # Bottom tabs: Home|Explore|PostListing|Messages|Profile
├── store/index.ts        # All Zustand stores (MMKV-persisted)
├── data/                 # Mock data — no real API yet
├── lib/utils.ts          # formatCredits, formatPrice, timeAgo
├── types/index.ts        # Shared TypeScript interfaces
└── constants/index.ts    # COLORS, DEMO_EMAIL/PASSWORD, CATEGORIES
```

## Navigation Flow

```
RootNavigator
├── <Auth>  (isAuthenticated === false)
│   ├── Login
│   └── Register
└── <Main>  (isAuthenticated === true)
    ├── Tabs: Home | Explore | PostListing | Messages | Profile
    └── Stack modals: Notifications | Conversation | Membership | Credits
```

All navigators use typed params — always use `RootStackScreenProps<T>`, `AuthStackScreenProps<T>`, or `MainTabScreenProps<T>` from `@/navigation/types`.

## State Management (Zustand + MMKV)

All stores live in `src/store/index.ts`. Persisted via MMKV (not AsyncStorage — much faster).

| Store | MMKV key | Persisted fields |
|---|---|---|
| `useCreditStore` | `modami-credits` | `balance` |
| `useAuthStore` | `modami-auth-v2` | `user`, `isAuthenticated`, `accounts` |
| `useProductStore` | `modami-products` | `unlockedProductIds`, `favorites`, `filters` |
| `useMembershipStore` | `modami-membership` | `tier`, `billingCycle`, `subscribedAt`, `renewsAt` |
| `useNotificationStore` | _(no persist)_ | notifications, unreadCount |

**Cross-store dependency:** `useCreditStore` is declared first — `useAuthStore` and `useMembershipStore` call `useCreditStore.getState()` directly.

## NativeWind (Tailwind CSS for React Native)

- NativeWind v4 + Tailwind CSS v3
- CSS entry: `import './global.css'` is the **first import** in `App.tsx`
- Metro: `withNativeWind(config, { input: './global.css' })` in `metro.config.js`
- Babel: `'nativewind/babel'` goes in **`presets`** array (NOT `plugins`) — it's a Babel preset returning `{ plugins: [...] }`
- Path alias: `@/*` → `src/*` (configured in `tsconfig.json` + `babel.config.js` via `module-resolver`)

**After any config change:** always run `npm start -- --reset-cache`.

## Design Tokens

Defined in `src/constants/index.ts` (`COLORS`) and `tailwind.config.js`. Mirrors the web storefront palette:

| Token | Value | Use |
|---|---|---|
| `primary` | `#274f38` | Brand green, primary actions |
| `primary-container` | `#3f674f` | Larger brand surfaces |
| `secondary` | `#5f5e5e` | Neutral text, icons |
| `background` | `#f9f9f8` | App background |
| `surface` | `#ffffff` | Cards |
| `surface-container` | `#edeeed` | Section backgrounds |
| `on-surface` | `#191c1c` | Primary text (never pure black) |

**No hard borders** — separate sections with background color shifts (`surface` on `surface-container`).

**Shadows** (for elevated cards):
```js
{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }
```

## Demo Auth

- Demo credentials: `demo@modami.app` / `demo1234`
- Registered accounts stored **unencrypted in MMKV** — mock only, not production-safe
- OAuth (Google/Apple) is simulated with a 500ms delay and mock user data

## Current State

All data is **client-side mock** — `src/data/` folder. No real API backend integrated yet. All screens are functional with mock data.

## Icons

`lucide-react-native` with `react-native-svg` peer. `TabBarIcon` in `src/components/atoms/` wraps the 5 icons used in the tab bar.
