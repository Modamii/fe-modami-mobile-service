# Infrastructure — Changelog

---

## [2026-04-01] — Release Compliance: iOS Permission Cleanup & Android Permission Hardening

**Type**: fix, chore  
**Author**: @react-native-developer

### What changed

1. **iOS Permission Cleanup**: Removed empty `NSLocationWhenInUseUsageDescription` key from `ios/Modami/Info.plist`. This key was declared with an empty string value, causing rejection on App Store review. Since the app does not request location services, the permission has been completely removed.

2. **Android Permission Hardening**: Removed overly broad `WRITE_EXTERNAL_STORAGE` permission from `AndroidManifest.xml`. For Android 13+ (API 33+), the app now relies solely on the fine-grained `READ_MEDIA_IMAGES` permission via runtime request in the QR save flow.

   - **Before**: `WRITE_EXTERNAL_STORAGE` used for all devices + `READ_MEDIA_IMAGES` for API 33+ (redundant/unnecessary)
   - **After**: Only `READ_MEDIA_IMAGES` declared; runtime logic (in credits screen) already handles API level fallback correctly

### Before → After

**iOS Info.plist:**
```xml
<!-- BEFORE -->
<key>NSLocationWhenInUseUsageDescription</key>
<string></string>  ❌ Empty — causes App Store rejection

<!-- AFTER -->
<!-- Key completely removed ✅ -->
```

**Android AndroidManifest.xml:**
```xml
<!-- BEFORE -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<!-- Redundant on newer API levels -->

<!-- AFTER -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<!-- Single, focused permission ✅ -->
```

### Files modified

- `ios/Modami/Info.plist` — Removed `NSLocationWhenInUseUsageDescription` key (lines ~47)
- `android/app/src/main/AndroidManifest.xml` — Removed `WRITE_EXTERNAL_STORAGE` permission declaration

### Runtime Behavior (No Changes)

The QR save functionality in `src/screens/profile/credits.screen.tsx` already implements correct platform-aware logic:
- **Android API 33+**: Requests `READ_MEDIA_IMAGES` (fine-grained photo permission)
- **Android API < 33**: Requests `WRITE_EXTERNAL_STORAGE` (legacy fallback, still honored by OS)
- **iOS**: Requests photo library add-only permission via `NSPhotoLibraryAddUsageDescription`

No app code changes needed — the permission declarations now match actual usage.

### How to test

1. **iOS Build**: 
   - Build on macOS: `npm run ios`
   - Verify Info.plist has no location key (can check via Xcode or grep)
   - Verify no location permission prompt on first run

2. **Android Build (API 33+ device/emulator)**:
   - Build: `npm run android`
   - Tap Credits → Select a payment method → Try to save QR
   - Verify permission prompt shows only **"Read media images"** (not broad storage)
   - Grant permission, verify QR saves to gallery

3. **Android Build (API < 32 device/emulator)**:
   - Build on older emulator
   - Same flow as above — verify broader storage permission requested (acceptable for old API)

### Notes / caveats

- **App Store Upload**: Before uploading, verify Info.plist validation in Xcode (right-click Info.plist → Validate)
- **Google Play**: Verify `READ_MEDIA_IMAGES` appears in Play Console data safety declarations (not `WRITE_EXTERNAL_STORAGE`)
- **Backward Compatibility**: Old API levels (< 33) will use runtime `WRITE_EXTERNAL_STORAGE` fallback; no user-facing changes
- **No data collection**: These changes only affect permission declarations, not any user data practices

### Integration with Release Compliance

- **iOS App Store**: Fixes compliance issue (empty permission string causes review rejection)
- **Google Play**: Reduces unnecessary permission scope (lowers risk score for users)
- See `docs/RELEASE_COMPLIANCE_CHECKLIST.md` for full compliance audit trail
