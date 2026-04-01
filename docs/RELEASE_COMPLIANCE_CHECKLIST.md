# ModaMi Mobile — Release Compliance Checklist

**Last Updated**: 2026-04-01  
**Purpose**: Ensure app store compliance (Apple App Store & Google Play) before each release.

---

## Apple App Store — Privacy Labels (App Privacy)

Apple requires transparent disclosure of data collection via **App Privacy** section in App Store Connect.

### Data Collection Categories to Declare

| Category | Collected | Purpose | Notes |
|----------|-----------|---------|-------|
| **User ID** | ✅ Yes | Account identification, user profile | User account email + username |
| **Name** | ✅ Yes | Profile display, communications | User full name from registration |
| **Email** | ✅ Yes | Account authentication, notifications | Registration email |
| **Phone** | ✅ Conditional | Seller contact, order communication | Only if user provides (optional field) |
| **Photos** | ✅ Yes | Product listings (uploads) | Camera roll access for product images |
| **Location** | ❌ No | None — **REMOVE** empty permission from Info.plist | NSLocationWhenInUseUsageDescription removed |
| **Contacts** | ❌ No | None — Not used | Not declared in app |
| **Calendar** | ❌ No | None — Not used | Not declared in app |
| **Health Data** | ❌ No | None — Not used | Not declared in app |

### Data Usage & Tracking Disclosure

- **Data Linked to User**: ✅ Yes (User ID, Name, Email tied to profile)
- **Data NOT Linked to User**: ❌ No (All data is user-linked)
- **Tracking**: ❌ No (No cross-app or cross-site tracking)
- **Third-party Sharing**: ❌ No (Except backend API — disclosed to Apple)

### App Store Connect Checklist

**Before submitting to App Store, complete:**

- [ ] In App Store Connect > Your App > App Privacy:
  - [ ] Add data types: **User ID**, **Name**, **Email**, **Phone** (if applicable), **Photos**
  - [ ] Mark each as "Linked to User Identity" (NOT "Linked to Device")
  - [ ] Set Purpose: "App Functionality & Personalization"
  - [ ] Confirm **NO tracking** enabled
  - [ ] Confirm **NO third-party data sharing** (backend API call is not "sharing")
- [ ] Verify **NSLocationWhenInUseUsageDescription** removed from `Info.plist`
- [ ] Verify **NSPhotoLibraryUsageDescription** present for image selection
- [ ] Verify **NSPhotoLibraryAddUsageDescription** present for QR save (`NSPhotoLibraryAddUsageDescription`)
- [ ] Verify **NSCameraUsageDescription** present for photo capture
- [ ] Review Privacy Policy URL before submission

---

## Google Play — Data Safety (Google Play Data Safety)

Google Play requires **Data Safety** declaration for all sensitive permissions and data handling.

### Permissions & Risk Assessment

| Permission | Used | Risk | Justification |
|-----------|------|------|----------------|
| **INTERNET** | ✅ Yes | Low | Required for API calls |
| **READ_MEDIA_IMAGES** | ✅ Yes | Low | Product images, selected by user |
| **WRITE_EXTERNAL_STORAGE** | ❌ No — **REMOVED** | High | Removed — uses READ_MEDIA_IMAGES instead (API 33+) |
| **CAMERA** | ✅ Yes | Medium | Optional — user can choose gallery instead |

### 1. Security Practices

- [ ] **HTTPS only**: All API calls use HTTPS/TLS — ✅ Verified in `NSAppTransportSecurity` (no arbitrary loads)
- [ ] **Data encryption in transit**: ✅ TLS 1.2+
- [ ] **Data at rest**: ✅ MMKV (encrypted via platform secure storage)
- [ ] **Authentication**: ✅ Bearer token stored securely (token.storage.ts)

### 2. Data Handling Practices

**User-provided data:**
- Email, username, password, name → Sent to backend via HTTPS
- Photos → Uploaded to backend (user controls what's shared)
- Phone number → Stored locally + sent if user provides
- User bio/location → Profile customization

**Data NOT collected:**
- Location (permission removed)
- Contacts
- Calendar
- Health
- Precise location tracking

**Data life cycle:**
- Data persisted locally via MMKV (encrypted)
- Session cleared on logout
- Account deletion purges local state + backend (DELETE /users/me)

### 3. Sensitive Permissions

| Permission | Risk | Mitigation |
|-----------|------|-----------|
| **READ_MEDIA_IMAGES** | Medium | User selects specific images; no automatic access |
| **CAMERA** | Medium | Optional; user can deny and use gallery |
| ~~WRITE_EXTERNAL_STORAGE~~ | High | **Removed** — uses fine-grained READ_MEDIA_IMAGES (API 33+) |

### Google Play Data Safety Checklist

**Before submitting to Play Store, complete:**

- [ ] In Google Play Console > App > Data Safety > Secure your app:
  - [ ] Mark "Data encryption in transit" → **Yes** (TLS)
  - [ ] Confirm "Data encryption at rest" → **Yes** (MMKV / Keychain)
- [ ] In Data Safety > Data Collection & Safety:
  - [ ] Declare data types: **Email**, **Username**, **Name**, **Phone** (optional), **Photos** (user-provided)
  - [ ] Mark collection purpose: "App Functionality & Personalization"
  - [ ] Confirm **NO third-party sharing** beyond necessary backend API
  - [ ] Confirm **NO advertising/tracking** pixels
- [ ] In Permissions:
  - [ ] **READ_MEDIA_IMAGES** — Required for gallery access
  - [ ] **CAMERA** — Optional; user denies → use gallery
  - [ ] ~~**WRITE_EXTERNAL_STORAGE**~~ — **Removed** for devices API 33+
  - [ ] **INTERNET** — Required for API calls
  - [ ] Verify **NO location permission** requested (NSLocationWhenInUseUsageDescription removed)
- [ ] Update Privacy Policy URL & ensure it matches declaration

---

## Implementation Checklist for Release Team

### Configuration Files

- [ ] **ios/Modami/Info.plist**
  - [ ] ✅ NSLocationWhenInUseUsageDescription → **Removed** (was empty)
  - [ ] ✅ NSCameraUsageDescription → Present + descriptive
  - [ ] ✅ NSPhotoLibraryUsageDescription → Present + descriptive
  - [ ] ✅ NSPhotoLibraryAddUsageDescription → Present (for QR save)
  - [ ] ✅ NSAppTransportSecurity.NSAllowsArbitraryLoads → **false** (HTTPS only)

- [ ] **android/app/src/main/AndroidManifest.xml**
  - [ ] ✅ INTERNET → Present
  - [ ] ✅ READ_MEDIA_IMAGES → Present
  - [ ] ✅ ~~WRITE_EXTERNAL_STORAGE~~ → **Removed** (or restricted to maxSdkVersion 32)
  - [ ] ✅ CAMERA → Present with purpose string

### Source Code

- [ ] **src/services/user.service.ts**
  - [ ] ✅ `deleteAccount()` method added (DELETE /users/me)

- [ ] **src/store/app.store.ts**
  - [ ] ✅ `AuthState.deleteAccount()` added
  - [ ] ✅ Clears tokens + local state on success

- [ ] **src/screens/profile/profile.screen.tsx**
  - [ ] ✅ Delete Account button added with confirmation dialog
  - [ ] ✅ Privacy Policy + Terms links added at bottom
  - [ ] ✅ Logout function preserves

- [ ] **src/screens/auth/register.screen.tsx**
  - [ ] ✅ Consent checkbox added (Terms + Privacy required)
  - [ ] ✅ Checkbox blocks form submission if unchecked
  - [ ] ✅ Links to Privacy Policy & Terms clickable

- [ ] **src/screens/auth/login.screen.tsx**
  - [ ] ✅ Privacy & Terms links added at bottom
  - [ ] ✅ Links to correct URLs

### Permissions Handling

- [ ] **Credits QR Save (Android)**
  - [ ] ✅ SDK >= 33 → Use READ_MEDIA_IMAGES (fine-grained)
  - [ ] ✅ SDK < 33 → Fall back to WRITE_EXTERNAL_STORAGE (broad, acceptable for older API)
  - [ ] ✅ User sees clear permission strings

---

## URLs to Update in App Store / Play Store Listings

Before submission, ensure these URLs are **publicly accessible** and current:

- **Privacy Policy**: `https://modami.vn/privacy-policy`
- **Terms of Service**: `https://modami.vn/terms-of-service`
- **Support Email**: `support@modami.vn` (or app support channel)

---

## Pre-Release Testing Checklist

### Manual Testing

- [ ] **iOS Device**: Permissions screens display correct Vietnamese text
- [ ] **Android Device**: Permissions request for READ_MEDIA_IMAGES (not WRITE_EXTERNAL_STORAGE on API 33+)
- [ ] **Delete Account**: Confirm dialog, API call executes, local state cleared, login screen shown
- [ ] **Logout**: User data cleared, login screen shown
- [ ] **Consent in Register**: Cannot proceed without checking box; links open correctly
- [ ] **Privacy Links**: All links (login, register, profile) open correct URLs

### Automated Checks

Run before submission:

```bash
npm run lint              # ESLint pass
npx tsc --noEmit         # TypeScript no errors
npm test                 # Unit tests pass (if any)
```

### Store Listing Preview

- [ ] **App Icon**: ✅ Rounded corners, meets guidelines
- [ ] **Screenshots**: ✅ Highlight privacy features
- [ ] **Privacy Policy**: ✅ Linked & accessible
- [ ] **Permissions Disclosure**: ✅ Justified in description

---

## Iteration Notes

### Known Limitations & To-Do

- Social login (OAuth) disabled — not yet integrated (ref: CLAUDE.md)
- Backend API (`DELETE /users/me`) must be implemented before release
- Privacy Policy & Terms pages must be live at specified URLs
- Location permission removed — if needed later, re-add NSLocationWhenInUseUsageDescription + reason

### Next Release Cycle

- [ ] Consider adding in-app privacy control dashboard (e.g., "Export my data", "Download report")
- [ ] Audit backend API for GDPR/CCPA compliance
- [ ] Implement app data signing (iOS) / APK signing verification (Android)
- [ ] Add privacy notice in onboarding flow (if needed by region)

---

## References

- [Apple App Privacy](https://developer.apple.com/app-store/app-privacy-details/)
- [Google Play Data Safety](https://play.google.com/console/about/data-safety/)
- [React Native Permissions (iOS)](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/)
- [Android Runtime Permissions API 33+](https://developer.android.com/about/versions/13/changes/granular-media-permissions)
- [CCPA/Privacy Laws](https://oag.ca.gov/privacy/ccpa) (if applicable to users in CA/EU)
