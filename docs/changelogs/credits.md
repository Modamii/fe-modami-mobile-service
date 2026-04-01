# Credits — Changelog

## [2026-04-01] — Harden Android QR Save Permission Flow

**Type**: fix
**Author**: @react-native-developer

### What changed
Tinh chỉnh luồng xin quyền lưu QR trên Android theo từng API level để giảm rủi ro policy:
- API >= 33: xin `READ_MEDIA_IMAGES`
- API 29-32: không xin quyền ghi ngoài (scoped storage)
- API <= 28: xin `WRITE_EXTERNAL_STORAGE` (legacy)

### Before -> After
Before: API < 33 đều xin `WRITE_EXTERNAL_STORAGE`.
After: Chỉ API <= 28 mới xin `WRITE_EXTERNAL_STORAGE`.

### Files modified
src/screens/profile/credits.screen.tsx — cập nhật nhánh xin quyền theo API level.
android/app/src/main/AndroidManifest.xml — giới hạn `WRITE_EXTERNAL_STORAGE` còn `maxSdkVersion=28`.

### How to test
1. Android 13+ (API 33+): thử lưu QR, xác nhận chỉ xin quyền ảnh.
2. Android 10-12L (API 29-32): thử lưu QR, xác nhận không bật prompt WRITE_EXTERNAL_STORAGE.
3. Android 9 trở xuống (API <= 28): thử lưu QR, xác nhận có prompt WRITE_EXTERNAL_STORAGE.

### Notes / caveats
Nếu product quyết định bỏ hỗ trợ API <= 28, có thể xóa hẳn `WRITE_EXTERNAL_STORAGE` trong manifest.
