# Feature Changelogs

Mỗi file trong thư mục này là nhật ký thay đổi của một tính năng cụ thể.

## Quy ước

- **Một file per tính năng** — xem danh sách đầy đủ trong `CLAUDE.md` (section "Changelog Convention")
- **Entries mới nhất ở đầu file** — newest first
- **Ghi lại sau mọi thay đổi** — phát triển mới, bug fix, refactor, dependency update
- **Template**: `.claude/templates/docs/changelogs/FEATURE_CHANGELOG_TEMPLATE.md`

## Files

| File | Tính năng |
|------|-----------|
| `auth.md` | Login, Register, OTP, quên mật khẩu |
| `home.md` | Home feed |
| `explore.md` | Search + filter + grid |
| `products.md` | Product detail, unlock |
| `messages.md` | Messages / chat |
| `notifications.md` | Notifications |
| `post-listing.md` | Đăng bán (sell form) |
| `profile.md` | Profile |
| `credits.md` | Credits system |
| `membership.md` | Membership / subscription |
| `navigation.md` | Navigation / routing |
| `design-system.md` | Design tokens, components |
| `api-integration.md` | Backend API integration |
| `infrastructure.md` | Config, dependencies, CI/CD |

## Ai ghi changelog?

Trách nhiệm của `@documentation-writer`. Invoke agent này sau khi hoàn thành implementation của bất kỳ tính năng nào.
