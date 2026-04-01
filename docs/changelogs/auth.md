# Auth — Changelog

---

## [2026-04-01] — Release Compliance: Consent Checkbox & Delete Account

**Type**: feat  
**Author**: @react-native-developer

### What changed

1. **Registration Consent Requirement**: Added mandatory checkbox on Step 1 of register form requiring user to accept Terms of Service & Privacy Policy before proceeding. Checkbox is unchecked by default and blocks form submission with validation error if not checked.

2. **Account Deletion**: Integrated `DELETE /users/me` API call with in-app delete button in profile. Deletion shows confirmation dialog, calls API, clears all local auth state + credits, and redirects to login.

3. **Privacy Links**: Added clickable links to Privacy Policy & Terms of Service on both login and register screens. Also added at bottom of profile screen for accessibility.

### Before → After

**Registration form (Step 1):**
- Before: No consent requirement; user could register without acknowledging policies
- After: Mandatory checkbox with inline links; validation fails if unchecked

**Profile screen:**
- Before: Only Logout button
- After: Logout + Delete Account buttons, plus Privacy & Terms links at bottom

**Login screen:**
- Before: No legal document references
- After: Privacy Policy & Terms links visible at bottom

### Files modified

- `src/screens/auth/register.screen.tsx` — Added CheckIcon import, consent checkbox UI with validation
- `src/screens/auth/hooks/useRegisterScreen.ts` — Added `consent` field to Zod schema (required: true)
- `src/screens/auth/login.screen.tsx` — Added Linking import, Privacy & Terms links at bottom
- `src/screens/profile/profile.screen.tsx` — Added `deleteAccount` store method, delete button + confirmation dialog, privacy/legal links
- `src/store/app.store.ts` — Added `deleteAccount` method to AuthState interface & implementation
- `src/services/user.service.ts` — Added `deleteAccount()` async method calling `DELETE /users/me`

### How to test

1. **Register Flow**:
   - Navigate to Register screen
   - Try clicking Continue without checking consent → error message appears
   - Check consent box → error clears, Continue button enabled
   - Click Privacy/Terms links → external browser opens (verify URLs work)

2. **Delete Account**:
   - Login as authenticated user
   - Go to Profile → scroll to bottom
   - Tap "Xóa tài khoản" → confirmation dialog appears
   - Tap "Xóa" → API called, user redirected to login, state cleared

3. **Login Privacy Links**:
   - Open Login screen
   - Scroll to bottom → verify Privacy Policy & Terms links visible
   - Tap each link → external browser opens

### Notes / caveats

- Backend API `DELETE /users/me` must be implemented (not mock yet)
- Privacy Policy & Terms URLs must be publicly accessible
- Delete account dialog uses Vietnamese text ("Xóa tài khoản?", "Hành động này sẽ xóa vĩnh viễn...")
- On Android, no permission changes needed for this feature
- iOS Info.plist photo permissions already support consent flow (ask on first use)

### Integration with Release Compliance

This change fulfills Apple App Store & Google Play data privacy requirements:
- Explicit user consent for data collection (via checkbox)
- Privacy Policy & Terms accessible in-app
- Account deletion right honored (GDPR/CCPA)
- See `docs/RELEASE_COMPLIANCE_CHECKLIST.md` for full App Store checklist
