# Profile — Changelog

## [2026-04-01] — Add In-App Account Deletion And Legal Links

**Type**: feat
**Author**: @react-native-developer

### What changed
Thêm hành động Xóa tài khoản trực tiếp trong màn hình hồ sơ với hộp thoại xác nhận, gọi API `DELETE /users/me`, sau đó xóa token/local state và đưa người dùng về màn hình đăng nhập. Đồng thời thêm liên kết Chính sách bảo mật và Điều khoản dịch vụ trong màn hình hồ sơ.

### Before -> After
Before: Chỉ có Đăng xuất, không có đường dẫn xóa tài khoản và legal links.
After: Có cả Đăng xuất, Xóa tài khoản và legal links truy cập ngay trong app.

### Files modified
src/screens/profile/profile.screen.tsx — thêm nút Xóa tài khoản, dialog xác nhận, legal links.
src/store/app.store.ts — thêm `deleteAccount()` để clear state sau khi backend deactive account.
src/services/user.service.ts — thêm `deleteAccount()` gọi endpoint `DELETE /users/me`.

### How to test
1. Đăng nhập vào app và mở tab Hồ sơ.
2. Nhấn Xóa tài khoản và xác nhận.
3. Kiểm tra app quay về trạng thái chưa đăng nhập.
4. Nhấn các liên kết Chính sách bảo mật/Điều khoản để xác nhận mở URL.

### Notes / caveats
Endpoint backend `DELETE /users/me` phải hoạt động ở môi trường release để pass checklist store review.
