import type { Notification } from '@/types/app.type';

const now = Date.now();
const min = 60000;
const hour = 3600000;
const day = 86400000;

export const mockNotifications: Notification[] = [
  // ── Unread — hôm nay ──────────────────────────────────────────────────────
  {
    id: 'n001',
    type: 'sale',
    title: 'Bài đăng được duyệt!',
    body: 'Blazer Len Kẻ Sọc H&M của bạn đã được duyệt và đang live trên marketplace.',
    isRead: false,
    createdAt: new Date(now - 15 * min).toISOString(),
    actionRoute: 'MyListings',
  },
  {
    id: 'n002',
    type: 'like',
    title: 'Thu Hà đã thích sản phẩm của bạn',
    body: 'Váy Midi Hoa Nhí Vintage — Thập Niên 90',
    isRead: false,
    createdAt: new Date(now - 45 * min).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    actionRoute: 'ProductDetail',
    actionId: 'mm-u002',
  },
  {
    id: 'n003',
    type: 'comment',
    title: 'Minh Tuấn bình luận về sản phẩm của bạn',
    body: '"Size M này có phù hợp với người vai 42cm không bạn?"',
    isRead: false,
    createdAt: new Date(now - 1.5 * hour).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    actionRoute: 'ProductDetail',
    actionId: 'mm-u001',
  },
  {
    id: 'n004',
    type: 'news',
    title: 'Bộ sưu tập Tết 2026 đã ra mắt',
    body: 'Khám phá 50+ sản phẩm vintage được tuyển chọn đặc biệt cho mùa Tết. Ưu đãi giảm 20% credits khi unlock.',
    isRead: false,
    createdAt: new Date(now - 2 * hour).toISOString(),
    detail: `ModaMi tự hào giới thiệu bộ sưu tập **Tết Bền Vững 2026** — hơn 50 sản phẩm vintage được tuyển chọn kỹ lưỡng bởi đội ngũ curator của chúng tôi.

**Điểm nổi bật của bộ sưu tập:**
• Áo dài cách tân từ vải lụa vintage thập niên 80–90
• Phụ kiện truyền thống được tái diễn giải hiện đại
• Bộ trang phục Tết phong cách Indochine

**Ưu đãi đặc biệt:**
Từ nay đến 25/01/2026, tất cả sản phẩm trong bộ sưu tập Tết chỉ cần 1 credit để unlock thông tin người bán (giảm từ 2 credits thông thường).

Đây là cơ hội tuyệt vời để sở hữu những món đồ vintage độc đáo, mang đậm bản sắc văn hóa Việt mà vẫn hoàn toàn phù hợp với phong cách sống hiện đại.

*ModaMi — Thời trang bền vững, phong cách riêng bạn.*`,
  },
  {
    id: 'n005',
    type: 'sale',
    title: 'Có người đang quan tâm đến bài đăng của bạn',
    body: 'Áo Sơ Mi Linen Trắng Uniqlo nhận được 8 lượt xem trong 1 giờ qua.',
    isRead: false,
    createdAt: new Date(now - 2.5 * hour).toISOString(),
    actionRoute: 'MyListings',
  },
  {
    id: 'n006',
    type: 'follow',
    title: 'Lan Anh đã theo dõi bạn',
    body: 'Bạn có thêm 1 người theo dõi mới.',
    isRead: false,
    createdAt: new Date(now - 3 * hour).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
  },

  // ── Hôm qua ────────────────────────────────────────────────────────────────
  {
    id: 'n007',
    type: 'sale',
    title: 'Đơn hàng của bạn đã được xác nhận',
    body: 'Túi Tote Canvas Hermès Inspired — Archive Studio HN đã xác nhận đơn hàng.',
    isRead: true,
    createdAt: new Date(now - 20 * hour).toISOString(),
    actionRoute: 'OrderHistory',
  },
  {
    id: 'n008',
    type: 'like',
    title: 'Hương Giang và 12 người khác đã thích sản phẩm',
    body: 'Blazer Len Kẻ Sọc H&M đang được nhiều người quan tâm!',
    isRead: true,
    createdAt: new Date(now - 22 * hour).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    actionRoute: 'ProductDetail',
    actionId: 'mm-u001',
  },
  {
    id: 'n009',
    type: 'system',
    title: 'Bài đăng cần điều chỉnh',
    body: 'Túi Tote Canvas Thêu Tay bị từ chối. Lý do: Ảnh không đạt yêu cầu.',
    isRead: true,
    createdAt: new Date(now - 1 * day).toISOString(),
    detail: `Bài đăng **Túi Tote Canvas Thêu Tay** của bạn không được phê duyệt vì các lý do sau:

**Lý do từ chối:** Ảnh không đạt yêu cầu

**Chi tiết:**
Ảnh sản phẩm bị tối và không rõ chi tiết thêu. ModaMi yêu cầu ảnh phải:
• Chụp trong điều kiện ánh sáng tự nhiên tốt
• Rõ nét, không bị mờ hoặc nhòe
• Thể hiện đầy đủ các chi tiết đặc trưng của sản phẩm
• Tối thiểu 3 góc chụp khác nhau

**Gợi ý từ đội ngũ kiểm duyệt:**
Chụp lại trong điều kiện ánh sáng ban ngày, chụp cận cảnh phần thêu tay để người mua có thể đánh giá chất lượng. Sau đó bạn có thể gửi lại bài đăng.

Nếu có thắc mắc, vui lòng liên hệ support@modami.app`,
    actionRoute: 'MyListings',
  },
  {
    id: 'n010',
    type: 'news',
    title: 'Hướng dẫn: Chụp ảnh sản phẩm đạt chuẩn ModaMi',
    body: 'Học cách chụp ảnh đẹp để bài đăng của bạn được duyệt nhanh hơn và thu hút nhiều người mua hơn.',
    isRead: true,
    createdAt: new Date(now - 1.2 * day).toISOString(),
    detail: `# Chụp ảnh sản phẩm đạt chuẩn ModaMi

Ảnh đẹp = bài đăng được duyệt nhanh = bán được nhanh hơn. Dưới đây là các tips từ đội ngũ curator ModaMi.

## Ánh sáng
Ánh sáng tự nhiên ban ngày là lựa chọn tốt nhất. Đặt sản phẩm gần cửa sổ, tránh ánh nắng trực tiếp gây bóng đổ cứng. Tránh dùng flash của điện thoại vì sẽ làm màu sắc sản phẩm bị sai lệch.

## Nền ảnh
Dùng nền trắng hoặc trung tính (xám nhạt, kem). Nền phải đơn giản, không có vật thể gây phân tâm. Một tờ giấy trắng khổ A0 đặt trên sàn là lựa chọn kinh tế và hiệu quả.

## Góc chụp bắt buộc
Mỗi sản phẩm cần có ít nhất 3-4 ảnh:
1. **Ảnh tổng thể** — toàn bộ sản phẩm, thấy rõ hình dáng
2. **Ảnh chi tiết** — logo, tag nhãn, texture vải
3. **Ảnh tình trạng** — các vết mòn, phai màu (nếu có)
4. **Ảnh mặc lên người** hoặc trên hanger (tùy chọn, tăng mức độ tin tưởng)

## Lỗi phổ biến cần tránh
- Ảnh mờ, rung
- Ngón tay che khuất sản phẩm
- Ảnh quá tối hoặc quá sáng
- Chụp trên nền lộn xộn
- Thiếu ảnh chi tiết nhãn/tag

*Chúc bạn đăng bán thành công trên ModaMi!*`,
  },

  // ── Tuần này ──────────────────────────────────────────────────────────────
  {
    id: 'n011',
    type: 'sale',
    title: 'Bạn đã bán được sản phẩm!',
    body: 'Kính Mát Rayban Clubmaster đã được mua. Bạn nhận được 32 credits thưởng.',
    isRead: true,
    createdAt: new Date(now - 3 * day).toISOString(),
    actionRoute: 'MyListings',
  },
  {
    id: 'n012',
    type: 'comment',
    title: 'Lan Anh đã trả lời bình luận của bạn',
    body: '"Mình ship cả nước nha bạn, phí ship tính thêm nhé"',
    isRead: true,
    createdAt: new Date(now - 3 * day + hour).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
  },
  {
    id: 'n013',
    type: 'follow',
    title: 'Quốc Bảo đã theo dõi bạn',
    body: 'Bạn có thêm 1 người theo dõi mới.',
    isRead: true,
    createdAt: new Date(now - 4 * day).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: 'n014',
    type: 'sale',
    title: 'Đơn hàng đã giao thành công',
    body: 'Áo Khoác Da Vintage đã được giao. Đừng quên đánh giá người bán nhé!',
    isRead: true,
    createdAt: new Date(now - 4 * day + 2 * hour).toISOString(),
    actionRoute: 'OrderHistory',
  },
  {
    id: 'n015',
    type: 'system',
    title: 'Credits sắp hết hạn',
    body: 'Bạn có 15 credits sẽ hết hạn vào 05/04/2026. Sử dụng ngay để không bị mất.',
    isRead: true,
    createdAt: new Date(now - 5 * day).toISOString(),
    detail: `**15 credits** trong tài khoản của bạn sẽ **hết hạn vào ngày 05/04/2026**.

Credits hết hạn sẽ bị xóa tự động và không thể khôi phục.

**Cách sử dụng credits:**
Credits được dùng để mở khóa thông tin liên hệ của người bán (email, số điện thoại) trên từng sản phẩm.

**Mua thêm credits** để tránh bị hết và nhận thêm ưu đãi theo gói thành viên của bạn.`,
    actionRoute: 'Credits',
  },
  {
    id: 'n016',
    type: 'news',
    title: 'ModaMi x Recycled Fashion Month',
    body: 'Tháng 4 là tháng thời trang tái chế. ModaMi tham gia chiến dịch toàn cầu với loạt sự kiện đặc biệt.',
    isRead: true,
    createdAt: new Date(now - 6 * day).toISOString(),
    detail: `# ModaMi tham gia Recycled Fashion Month 2026

Tháng 4 năm nay, ModaMi chính thức là đối tác tại Việt Nam của chiến dịch **Global Recycled Fashion Month** — sự kiện thời trang bền vững lớn nhất thế giới.

## Sự kiện nổi bật trong tháng

**Tuần 1 (01–07/04): Detox Wardrobe Challenge**
Thách thức: Đăng bán ít nhất 5 món đồ không còn dùng đến. Top 10 người bán nhiều nhất nhận gói credits Premium miễn phí 3 tháng.

**Tuần 2 (08–14/04): Swap & Style Event (TP.HCM)**
Sự kiện trao đổi đồ trực tiếp tại The New Playground, Q.1. Mang đến 3 món đồ, đổi về 3 món đồ mới (theo hệ thống điểm ModaMi).

**Tuần 3 (15–21/04): Curator Spotlight**
16 curator hàng đầu ModaMi chia sẻ bộ sưu tập cá nhân và bí quyết tuyển chọn đồ vintage.

**Tuần 4 (22–30/04): Green Sale**
Giảm 30% phí unlock toàn bộ sản phẩm trong danh mục Outerwear và Accessories.

---
*Cùng nhau xây dựng văn hóa thời trang bền vững tại Việt Nam.*`,
  },

  // ── Tháng trước ───────────────────────────────────────────────────────────
  {
    id: 'n017',
    type: 'system',
    title: 'Nâng cấp app — phiên bản 2.4.0',
    body: 'ModaMi vừa cập nhật tính năng: Lịch sử mua hàng, Thông báo theo loại và nhiều cải tiến khác.',
    isRead: true,
    createdAt: new Date(now - 14 * day).toISOString(),
    detail: `# Cập nhật ModaMi v2.4.0

Chúng tôi vừa ra mắt phiên bản 2.4.0 với nhiều tính năng mới và cải tiến đáng kể.

## Tính năng mới
• **Lịch sử mua hàng** — Theo dõi toàn bộ đơn hàng, trạng thái giao hàng và mã vận đơn ngay trong app
• **Filter thông báo** — Lọc thông báo theo từng loại: Hoạt động, Mua bán, Hệ thống, Tin tức
• **Xác minh email** — Tăng độ tin cậy tài khoản khi đổi email
• **Chọn ngày sinh dễ dàng** — Giao diện picker mới trực quan hơn

## Cải tiến hiệu năng
• Tốc độ tải trang tăng 40%
• Giảm mức tiêu thụ pin khi dùng app nền
• Fix lỗi đăng ảnh trên một số thiết bị Android

Cảm ơn bạn đã đồng hành cùng ModaMi!`,
  },
  {
    id: 'n018',
    type: 'sale',
    title: 'Chúc mừng! Bạn đạt hạng Curator',
    body: 'Bạn đã bán 5 sản phẩm thành công. Khám phá quyền lợi thành viên Curator ngay.',
    isRead: true,
    createdAt: new Date(now - 20 * day).toISOString(),
    actionRoute: 'Membership',
  },
  {
    id: 'n019',
    type: 'news',
    title: 'Chính sách mới: Bảo vệ người mua 2026',
    body: 'ModaMi cập nhật chính sách hoàn tiền và giải quyết tranh chấp để bảo vệ tốt hơn cho cả người mua và bán.',
    isRead: true,
    createdAt: new Date(now - 25 * day).toISOString(),
    detail: `# Chính sách Bảo vệ Người Mua ModaMi 2026

Có hiệu lực từ **01/03/2026**, ModaMi áp dụng chính sách bảo vệ người mua được cập nhật toàn diện.

## Quyền lợi người mua

**Hoàn tiền trong 48 giờ** nếu:
- Sản phẩm không đúng mô tả (màu sắc, kích cỡ, tình trạng)
- Sản phẩm bị giả mạo thương hiệu
- Người bán không phản hồi sau 72 giờ kể từ khi thanh toán

**Quy trình khiếu nại:**
1. Chụp ảnh sản phẩm ngay khi nhận hàng
2. Mở khiếu nại trong vòng 48 giờ qua app
3. Đội ngũ ModaMi xử lý trong 3–5 ngày làm việc

## Quyền lợi người bán

Người bán cũng được bảo vệ khỏi các khiếu nại thiếu căn cứ. ModaMi xem xét toàn bộ bằng chứng từ cả hai phía trước khi đưa ra quyết định.

---
Chi tiết đầy đủ xem tại: modami.app/policy/buyer-protection`,
  },
  {
    id: 'n020',
    type: 'system',
    title: 'Chào mừng đến với ModaMi',
    body: 'Tham gia cộng đồng thời trang bền vững. Bắt đầu bằng cách đăng sản phẩm đầu tiên!',
    isRead: true,
    createdAt: new Date(now - 30 * day).toISOString(),
    detail: `# Chào mừng bạn đến với ModaMi!

**ModaMi** là nền tảng mua bán thời trang secondhand hàng đầu Việt Nam, nơi mỗi món đồ đều có câu chuyện riêng.

## Bắt đầu như thế nào?

**Để mua hàng:**
1. Duyệt sản phẩm trong tab Khám phá
2. Dùng Credits để unlock thông tin người bán
3. Liên hệ trực tiếp và hoàn tất giao dịch

**Để bán hàng:**
1. Nhấn nút + để đăng bài
2. Điền đầy đủ thông tin và upload ảnh đẹp
3. Chờ đội ngũ ModaMi kiểm duyệt (thường trong 24 giờ)

## Credits là gì?
Credits là tiền tệ nội bộ của ModaMi. Bạn nhận credits khi đăng ký, bán hàng thành công, hoặc nạp thêm. Dùng credits để xem thông tin liên hệ người bán.

Chúc bạn mua bán vui vẻ!`,
  },
];
