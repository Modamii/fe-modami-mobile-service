# API Integration — Changelog

---

## [2026-04-01] — Core Service Integration for Products, Home, Sellers, and Listings

**Type**: feat
**Author**: @react-native-developer

### What changed

- Added shared Core service base URL in axios layer and used it across Core-integrated services.
- Updated product service to call Core endpoints for catalog search, product detail, and similar products.
- Updated home service to compose home data from Core product feed/featured/select and categories endpoints.
- Updated seller service to fetch seller profile and listings from Core, with optional stats/reviews enrichment.
- Updated listing service to fetch my listings and listing detail from Core and submit new listings via Core create-product endpoint.
- Updated seller detail screen to use existing React Query hooks instead of direct mock imports.
- Preserved mock fallback in every updated service when API requests fail, so UI behavior remains stable offline or during API issues.

### Before → After

- Before: Product, home, seller, and listing flows were fully mock-driven in service layer.
- After: Services are API-first with safe fallback to existing mock data paths on failure.

### Files modified

- src/lib/axios.ts — added CORE_URL constant.
- src/services/product.service.ts — integrated search, detail, similar endpoints with DTO mappers and fallback.
- src/services/home.service.ts — composed HomeScreenData from Core endpoints with partial fallback behavior.
- src/services/seller.service.ts — integrated seller profile/listings (+ optional stats/reviews) with fallback.
- src/services/listing.service.ts — integrated my listings/detail/create endpoints with request/response mapping and fallback.
- src/screens/seller/seller-detail.screen.tsx — switched to seller query hooks and improved loading/error/retry handling.

### How to test

1. Open Explore and confirm product list still renders.
2. Open a product detail and confirm detail + similar products still render.
3. Open Home and confirm sections render even if any Core endpoint fails.
4. Open Seller Detail and verify loading state, retry behavior, and seller products grid.
5. Open My Listings and Listing Detail to verify status and metadata render.
6. Submit a new listing from Post Listing and confirm success flow still works.

### Notes / caveats

- Assumed Core success responses follow success/data/meta envelope but may return arrays directly under data or nested under items/products/rows, so services include tolerant unwrapping.
- Assumed category selection value in post listing can be sent as category_id directly until category-ID mapping is finalized.
- Assumed seller stats/reviews endpoints are optional and may fail independently; seller profile still renders when only base seller endpoint succeeds.
- Listing status mapping normalizes potential backend variants (pending/reviewing/published/active) into existing app statuses.
