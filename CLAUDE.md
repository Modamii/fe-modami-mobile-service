# ModaMi Mobile — Claude Instructions

> Stack: React Native 0.84 · TypeScript · NativeWind v4 · Zustand + MMKV · React Navigation v7
> Last updated: 2026-03-29

## Project Context

ModaMi Mobile là ứng dụng React Native (bare, không Expo) cho nền tảng thời trang secondhand Việt Nam. Người dùng có thể duyệt sản phẩm, mở khóa thông tin liên hệ bằng credits, đăng ký membership nhiều cấp, nhắn tin, và đăng bán đồ cũ. Toàn bộ dữ liệu hiện tại là mock phía client — chưa tích hợp backend thật.

**Tech stack summary**: React Native 0.84 (bare) · TypeScript 5.8 · NativeWind v4 + Tailwind CSS v3 · Zustand v5 + MMKV v3 · React Navigation v7

---

## Agents Available

**Bắt buộc phải delegate — không tùy chọn.** Mọi task thuộc domain của specialist PHẢI được route đến đúng agent. Không tự implement code, design schema, viết docs, hay config pipeline — hãy delegate. Chỉ xử lý trực tiếp: câu hỏi cấp project, quyết định routing, và các task nằm ngoài tất cả domain chuyên biệt.

| Agent | Role | Invoke khi... |
|-------|------|----------------|
| `project-manager` | Backlog & coordination | "Làm gì tiếp?", sprint planning, break down feature, reprioritize |
| `systems-architect` | Architecture & ADRs | Thiết kế feature mới, tech decision, system integration |
| `react-native-developer` | Mobile UI implementation | Screens, navigation, native modules, platform styling, mobile performance |
| `frontend-developer` | UI implementation (web) | Components, pages, client-side state, styling (nếu có web) |
| `backend-developer` | API & business logic | Endpoints, auth, background jobs, integrations |
| `ui-ux-designer` | UX & design system | User flows, wireframes, component specs, accessibility |
| `database-expert` | Schema & queries | Migrations, schema design, query optimization |
| `qa-engineer` | Testing | E2E tests, test strategy, coverage gaps |
| `documentation-writer` | Living docs | User guide updates, post-feature documentation |
| `cicd-engineer` | CI/CD & GitHub Actions | Pipelines, deployments, branch protection, release automation |
| `docker-expert` | Containerization | Dockerfiles, docker-compose, image optimization |
| `copywriter-seo` | Copy & SEO | App store copy, marketing content, brand voice |

---

## Critical Rules

Áp dụng cho mọi agent ở mọi thời điểm. Không có ngoại lệ trừ khi có lệnh rõ ràng từ người dùng.

1. **Không hardcode secrets, credentials, hay environment-specific values** trong source code.
2. **TODO.md là living backlog.** Agents có thể thêm items, đánh dấu complete, và move sang "Completed". Giữ nguyên thứ tự section và priority — không reorder trừ khi được yêu cầu.
3. **Mọi commit dùng Conventional Commits format** (xem Git Conventions bên dưới).
4. **Cập nhật docs/** sau mỗi thay đổi đáng kể trước khi đánh dấu task hoàn thành.
5. **Chạy test trước khi đánh dấu bất kỳ implementation task nào là complete.**
6. **Delegate đúng specialist.** Nếu task động đến mobile (React Native), backend, database, UX/design, QA, docs, CI/CD, Docker — invoke agent tương ứng ngay lập tức.
7. **Sau mọi config change:** chạy `npm start -- --reset-cache`.
8. **Commit thay đổi của mình; không push.** Tạo local commit (Conventional Commits). Không `git push` — orchestrator chịu trách nhiệm push và mở PR.
9. **Ghi changelog sau mỗi thay đổi.** Mọi phát triển, bug fix, hay cập nhật tính năng phải được ghi vào file changelog tương ứng trong `docs/changelogs/<feature>.md`. Đây là trách nhiệm của @documentation-writer — invoke agent đó sau khi hoàn thành implementation.

---

## Project Structure

```
fe-modami-mobile-service/
├── App.tsx                 # Root: GestureHandler → SafeArea → Navigation
├── global.css              # Tailwind CSS entry (imported FIRST in App.tsx)
├── tailwind.config.js      # Design tokens + NativeWind preset
├── babel.config.js         # @react-native/babel-preset + nativewind/babel (preset) + module-resolver
├── metro.config.js         # withNativeWind wrapper
├── index.js                # RN entry point
├── android/                # Android native project
├── ios/                    # iOS native project
├── src/
│   ├── screens/            # One folder per feature
│   │   ├── auth/           # Login, Register
│   │   ├── home/           # Feed screen
│   │   ├── explore/        # Search + filter + grid
│   │   ├── messages/       # Conversation list
│   │   ├── notifications/  # Notification list
│   │   ├── post-listing/   # Sell form
│   │   └── profile/        # Profile, Credits, Membership
│   ├── components/
│   │   ├── ui/             # Base primitives: Button, Input, AppText, Card
│   │   ├── atoms/          # TabBarIcon (lucide wrapper)
│   │   └── molecules/      # CreditChip, ProductCard
│   ├── navigation/
│   │   ├── types.ts        # All typed param lists + RootStackScreenProps helpers
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── store/index.ts      # All Zustand stores (MMKV-persisted)
│   ├── data/               # Mock data — no real API yet
│   ├── lib/utils.ts        # formatCredits, formatPrice, timeAgo
│   ├── types/index.ts      # Shared TypeScript interfaces
│   └── constants/index.ts  # COLORS, DEMO_EMAIL/PASSWORD, CATEGORIES
├── docs/                   # Developer documentation
│   ├── DEVELOPMENT.md      # Full dev guide (setup, patterns, troubleshooting)
│   └── apis/               # API integration docs (khi có backend)
└── .claude/
    ├── agents/             # Specialist agent definitions
    ├── commands/           # Slash command definitions
    └── templates/          # Blank doc templates (synced from upstream — không edit)
```

---

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

Tất cả navigators dùng typed params — luôn dùng `RootStackScreenProps<T>`, `AuthStackScreenProps<T>`, hoặc `MainTabScreenProps<T>` từ `@/navigation/types`.

---

## State Management (Zustand + MMKV)

Tất cả stores trong `src/store/index.ts`. Persist qua MMKV (không dùng AsyncStorage — nhanh hơn nhiều).

| Store | MMKV key | Persisted fields |
|---|---|---|
| `useCreditStore` | `modami-credits` | `balance` |
| `useAuthStore` | `modami-auth-v2` | `user`, `isAuthenticated`, `accounts` |
| `useProductStore` | `modami-products` | `unlockedProductIds`, `favorites`, `filters` |
| `useMembershipStore` | `modami-membership` | `tier`, `billingCycle`, `subscribedAt`, `renewsAt` |
| `useNotificationStore` | _(no persist)_ | notifications, unreadCount |

**Cross-store dependency:** `useCreditStore` được khai báo trước — `useAuthStore` và `useMembershipStore` gọi `useCreditStore.getState()` trực tiếp.

---

## Git Conventions

### Commit Format
```
<type>(<scope>): <short description>

[optional body]
[optional footer: Closes #issue]
```

**Types**: `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore` · `perf` · `ci`

Ví dụ:
```
feat(auth): add Google OAuth login simulation
fix(explore): handle empty search results state
refactor(store): extract MMKV storage factory to shared helper
docs(development): update screen creation guide
```

### Branch Naming
```
feature/<ticket-id>-short-description
fix/<ticket-id>-short-description
chore/<description>
docs/<description>
refactor/<description>
```

---

## Code Style

- **Language**: TypeScript (strict mode)
- **Formatter**: Prettier (`.prettierrc`)
- **Linter**: ESLint (`.eslintrc.js`)
- **Import alias**: `@/*` → `src/*` (tsconfig + babel module-resolver)
- **Styling**: NativeWind v4 `className` — không mix StyleSheet với className khi có thể tránh
- **Không `console.log`** trong production code
- **Không commented-out code** được commit — xóa hoặc track trong TODO.md
- **Icons**: `lucide-react-native` — không dùng emoji làm icon

---

## NativeWind (Tailwind CSS cho React Native)

- CSS entry: `import './global.css'` là **import đầu tiên** trong `App.tsx`
- Metro: `withNativeWind(config, { input: './global.css' })` trong `metro.config.js`
- Babel: `'nativewind/babel'` đặt trong **`presets`** array (KHÔNG phải `plugins`)
- Path alias: `@/*` → `src/*`

---

## Design Tokens

Định nghĩa trong `src/constants/index.ts` (`COLORS`) và `tailwind.config.js`:

| Token | Value | Dùng cho |
|---|---|---|
| `primary` | `#274f38` | Brand green, primary actions |
| `primary-container` | `#3f674f` | Larger brand surfaces |
| `secondary` | `#5f5e5e` | Neutral text, icons |
| `background` | `#f9f9f8` | App background |
| `surface` | `#ffffff` | Cards |
| `surface-container` | `#edeeed` | Section backgrounds |
| `on-surface` | `#191c1c` | Primary text (không dùng pure black) |

**Không dùng border cứng** — phân tách sections bằng background color shifts (`surface` trên `surface-container`).

**Shadows** (cho elevated cards):
```js
{ shadowColor: '#191c1c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 }
```

---

## Testing Conventions

- **Unit tests**: Jest — colocated `*.test.ts` cạnh source files
- **Run unit**: `npm test`
- **Chưa có E2E tests** — cần thiết lập Detox hoặc tương đương
- Coverage target: 80% cho features mới

---

## Environment & Commands

- **Node**: ≥ 22 (xem `.nvmrc` nếu có)
- **Package manager**: npm

```bash
npm start                    # Start Metro bundler
npm start -- --reset-cache   # Reset Metro cache (bắt buộc sau config changes)
npm run android              # Run on Android emulator/device
npm run ios                  # Run on iOS simulator (macOS + Xcode required)
npm run lint                 # ESLint
npm test                     # Jest unit tests
npx tsc --noEmit             # TypeScript check
```

**First iOS run:** `cd ios && pod install` trước `npm run ios`.

---

## Demo Auth

- Demo credentials: `demo@modami.app` / `demo1234`
- Registered accounts được lưu **unencrypted trong MMKV** — chỉ dùng cho mock, không production-safe
- OAuth (Google/Apple) được simulate với 500ms delay và mock user data

---

## Current State

Toàn bộ dữ liệu là **client-side mock** — thư mục `src/data/`. Chưa tích hợp API backend thật. Tất cả screens hoạt động với mock data.

---

## Changelog Convention

Mỗi tính năng có một file changelog riêng trong `docs/changelogs/`. Mọi thay đổi phải được ghi lại — phát triển mới, bug fix, refactor, hay cập nhật dependency.

### Feature → File mapping

| Tính năng | File |
|-----------|------|
| Auth (login, register, OTP, quên mật khẩu) | `docs/changelogs/auth.md` |
| Home feed | `docs/changelogs/home.md` |
| Explore / tìm kiếm | `docs/changelogs/explore.md` |
| Sản phẩm / mở khóa | `docs/changelogs/products.md` |
| Messages / chat | `docs/changelogs/messages.md` |
| Notifications | `docs/changelogs/notifications.md` |
| Post listing (đăng bán) | `docs/changelogs/post-listing.md` |
| Profile | `docs/changelogs/profile.md` |
| Credits | `docs/changelogs/credits.md` |
| Membership | `docs/changelogs/membership.md` |
| Navigation | `docs/changelogs/navigation.md` |
| Design system / tokens | `docs/changelogs/design-system.md` |
| API integration | `docs/changelogs/api-integration.md` |
| Infrastructure / config | `docs/changelogs/infrastructure.md` |

### Format mỗi entry

```markdown
## [YYYY-MM-DD] — [Brief title]

**Type**: feat | fix | refactor | perf | chore
**Author**: @agent-name hoặc tên người

### What changed
[Mô tả rõ ràng những gì thay đổi và tại sao]

### Before → After
[Chỉ cần cho bug fix và refactor]

### Files modified
src/screens/... — [what changed]

### How to test
1. [Bước kiểm tra]

### Notes / caveats
[Known limitations, follow-up tasks]
```

Entries mới nhất ở **trên đầu** file. Template đầy đủ ở `.claude/templates/docs/changelogs/FEATURE_CHANGELOG_TEMPLATE.md`.

---

## Key Documentation

- `docs/DEVELOPMENT.md` — Full developer guide: setup, patterns, troubleshooting
- `docs/apis/auth/INTERGRATE.md` — Auth API integration spec
- `docs/apis/users/INTEGRATE.md` — Users API integration spec
