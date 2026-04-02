# ModaMi Mobile — Developer Guide

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React Native (bare) | 0.84.1 |
| Language | TypeScript | ^5.8 |
| Styling | NativeWind v4 + Tailwind CSS v3 | 4.2.3 / 3.4.x |
| Navigation | React Navigation | v7 |
| State | Zustand | v5 |
| Persistence | react-native-mmkv | v3 |
| Icons | lucide-react-native | latest |

## Getting Started

### Prerequisites

- Node.js ≥ 22
- npm
- **Android:** Android Studio + emulator or physical device with USB debugging
- **iOS:** macOS, Xcode 16+, CocoaPods

### Installation

```bash
npm install

# iOS only — install native pods
cd ios && pod install && cd ..
```

### Running

```bash
# Start Metro bundler (keep this running in one terminal)
npm start

# In a second terminal, run on your platform:
npm run android
npm run ios
```

## Project Structure

```
rn-modami-service/
├── App.tsx                 # Root: GestureHandler → SafeArea → Navigation
├── global.css              # Tailwind CSS entry (imported first in App.tsx)
├── global.d.ts             # NativeWind TypeScript types
├── tailwind.config.js      # Design tokens + NativeWind preset
├── babel.config.js         # @react-native/babel-preset + nativewind/babel (preset) + module-resolver
├── metro.config.js         # withNativeWind wrapper
├── index.js                # RN entry point
├── android/                # Android native project
├── ios/                    # iOS native project
├── src/
│   ├── screens/            # Feature screens
│   ├── components/         # UI primitives and composites
│   ├── navigation/         # Navigators + typed param lists
│   ├── store/              # Zustand stores
│   ├── data/               # Mock data
│   ├── lib/                # Utilities
│   ├── types/              # TypeScript types
│   └── constants/          # App-wide constants and design tokens
└── docs/                   # Developer documentation
```

## Backend API Integration

Services use an **API-first with safe fallback** pattern. When an API request fails, the app gracefully falls back to mock data to ensure UI stability during API outages or offline scenarios.

### Backend URLs

Configured in `src/lib/axios.ts`:

| Service | URL | Used By |
|---|---|---|
| **CORE_URL** | `https://modami-core.techinsightsworld.com/v1/core-services` | Products, Home, Sellers, Listings |
| **AUTH_URL** | `https://modami-auth.techinsightsworld.com/v1/auth-services` | Login, Register, Auth flows |
| **USER_URL** | `https://modami-user.techinsightsworld.com/v1/user-services` | User profile, account settings |

### Service Pattern

All services in `src/services/` follow this architecture:

```ts
// 1. Use shared Core API payload types from src/types/store-core.types.ts
type StoreProduct = { id?: string; title?: string; /* ... */ };

// 2. Implement tolerant unwrapping (handles items/products/rows/categories)
function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data?.items) return data.items;
  if (data?.products) return data.products;
  return [];
}

// 3. Parse StoreEnvelope<T> and return payloads directly (no mapper layer)
// 4. Wrap API calls with fallback
export const myService = {
  getList: async () => {
    try {
      const res = await axiosClient.get('/endpoint');
      return { data: unwrapList<StoreProduct>(res.data), success: true };
    } catch {
      return { data: mockData, success: true }; // Silent fallback to mock
    }
  }
};
```

### Store Payload Type Strategy

Backend responses often use snake_case and nested objects. Services now keep payloads in Store* types and avoid object mapping inside service responses:

- Shared payload contracts live in `src/types/store-core.types.ts`
- Service methods parse `StoreEnvelope<T>` and unwrap lists with `unwrapList`
- When preserving existing method signatures is required, services use safe type assertions instead of field-by-field mapper functions

See `src/services/product.service.ts` and `src/services/home.service.ts` for examples.

## Adding a New Screen

**1. Add the route to `src/navigation/types.ts`:**
```ts
export type RootStackParamList = {
  // ...existing
  NewScreen: { someParam: string }; // or `undefined` if no params
};
```

**2. Create the screen file:**
```tsx
// src/screens/feature/NewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import type { RootStackScreenProps } from '@/navigation/types';

type Props = RootStackScreenProps<'NewScreen'>;

export function NewScreen({ navigation, route }: Props) {
  return (
    <View className="flex-1 bg-background px-5 py-4">
      <Text className="text-xl font-bold text-on-surface">New Screen</Text>
    </View>
  );
}
```

**3. Register in the appropriate navigator:**
```tsx
// src/navigation/RootNavigator.tsx
import { NewScreen } from '@/screens/feature/NewScreen';

<Stack.Screen name="NewScreen" component={NewScreen} />
```

## Styling with NativeWind

Use `className` on any React Native core component — same as Tailwind CSS but with RN-compatible utilities:

```tsx
// ✅ Correct
<View className="flex-1 bg-background px-5 py-4 gap-3">
  <Text className="text-xl font-bold text-primary tracking-tight">Title</Text>
  <Text className="text-sm text-secondary leading-relaxed">Body</Text>
</View>

// ❌ Avoid mixing StyleSheet with className where possible
```

**Design token classes:**

| Class | Token |
|---|---|
| `bg-primary` | #274f38 (emerald) |
| `text-primary` | #274f38 |
| `bg-background` | #f9f9f8 |
| `bg-surface` | #ffffff |
| `bg-surface-container` | #edeeed |
| `text-on-surface` | #191c1c |
| `text-secondary` | #5f5e5e |

**Opacity modifier:** `text-on-surface/70` → 70% opacity.

**NB:** After changing `tailwind.config.js` or `global.css`, always run:
```bash
npm start -- --reset-cache
```

## Adding a Zustand Store

All stores are in `src/store/index.ts`. Pattern:

```ts
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const mmkv = new MMKV();
const storage = createJSONStorage(() => ({
  getItem: (key) => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => mmkv.delete(key),
}));

interface MyState {
  value: string;
  setValue: (v: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    { name: 'my-store-key', storage },
  ),
);
```

## Navigation — Typed Params

Always use the typed helpers from `@/navigation/types`:

```tsx
// In a tab screen
type Props = MainTabScreenProps<'Home'>;

// In a root stack screen
type Props = RootStackScreenProps<'Credits'>;

// Navigate with type safety
navigation.navigate('ProductDetail', { productId: 'p001' });

// Access params
const { productId } = route.params;
```

## UI Components

### Base Primitives (`src/components/ui/`)

| Component | Props |
|---|---|
| `<Button>` | `variant?: 'primary'\|'secondary'\|'ghost'`, `size?: 'sm'\|'md'\|'lg'`, `loading?: boolean` |
| `<Input>` | `label?: string`, `error?: string`, all `TextInputProps` |
| `<AppText>` | `variant?: 'display'\|'headline'\|'body'\|'label'\|'caption'`, `weight?`, `muted?` |
| `<Card>` | `elevated?: boolean` |

### Molecules (`src/components/molecules/`)

| Component | Props |
|---|---|
| `<CreditChip>` | `onPress?: () => void` — shows live balance from `useCreditStore` |
| `<ProductCard>` | `product: Product`, `onPress: (p: Product) => void` |

## Linting & Type Checking

```bash
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript check (no output files)
```

## Troubleshooting

| Problem | Fix |
|---|---|
| Styles not applying | `npm start -- --reset-cache` |
| Metro stuck on old code | Kill Metro, run `npm start -- --reset-cache` |
| `nativewind/babel` error | Ensure it's in `presets`, not `plugins` in `babel.config.js` |
| iOS build fails | `cd ios && pod install` |
| Android build fails | Check `ANDROID_HOME` env var, ensure emulator is running |
| MMKV native error | Need to rebuild the native app: `npm run android` / `npm run ios` |
