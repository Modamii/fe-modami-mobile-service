import type { TrendBlog } from '@/types/app.type';

/**
 * Bộ dữ liệu editorial — tone chuyên sâu, có metadata đầy đủ cho UI lab / chi tiết bài.
 */
export const mockTrends: TrendBlog[] = [
  {
    id: 't001',
    title: 'Quiet Luxury trên thị trường secondhand: khi “ít hơn” định giá trị cao hơn',
    dek: 'Phân tích tâm lý tiêu dùng và cách Curator ModaMi tuyển lựa theo tiêu chí bền vững.',
    excerpt:
      'Không còn là trend thoáng qua: Quiet Luxury đang được tái định nghĩa trong re-commerce — nơi chất liệu, độ hiếm và tính đa năng quyết định giá trị thực.',
    topic: 'Xu hướng tiêu điểm',
    readTime: '8 phút đọc',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
    isFeatured: true,
    editorialSeries: 'ModaMi Insight · Số 12 · Q4/2025',
    author: 'Lan Phương Đỗ',
    authorRole: 'Lead Trend Analyst',
    authorBio: '10 năm theo dõi luxury & circular fashion tại châu Á–Thái Bình Dương.',
    publishedAt: '2025-11-02',
    updatedAt: '2025-11-08',
    wordCount: 1420,
    readingLevel: 'deep',
    coverCaption: 'Tông trung tính & texture tự nhiên — nền tảng của Quiet Luxury trên nền tảng re-commerce.',
    tags: ['quiet-luxury', 'curator-pick', 'circular-fashion', 'investment-piece'],
    keyTakeaways: [
      'Quiet Luxury ưu tiên “độ bền cảm quan”: vải, đường may và form dáng timeless.',
      'Trên ModaMi, các listing có tem Curator thường có tỷ lệ giữ giá tốt hơn 18–22% sau 12 tháng (mock nội bộ).',
      'Palette gợi ý: ivory, charcoal, warm grey — tối đa một điểm nhấn texture (len, cashmere, tweed).',
    ],
    sources: [
      'McKinsey State of Fashion · Circular segments (2024)',
      'ModaMi Internal Curator Scorecard · Q3 sample',
    ],
    body:
      'Quiet Luxury không đơn thuần là aesthetic tối giản — đó là một hợp đồng ngầm giữa người mua và vật phẩm: ít logo, nhiều chất liệu đáng tin, và khả năng mặc lặp trong nhiều ngữ cảnh.\n\n' +
      'Trên thị trường đồ cũ cao cấp, giá trị không còn phụ thuộc vào season mới nhất mà vào độ hiếm của form, tình trạng thực tế và “chuỗi sở hữu” minh bạch. ModaMi khuyến khích người bán cung cấp ảnh macro đường chỉ, tem mác và bối cảnh sử dụng — những tín hiệu mà buyer dùng để định giá niềm tin.\n\n' +
      'Về phối đồ: một blazer dáng cổ điển, một đôi loafers da và một chiếc knit mỏng đủ để tạo ba layer cho văn phòng và tối cuối tuần. Tránh chồng quá nhiều họa tiết; để chất liệu là nhân vật chính.\n\n' +
      'Kết luận: Quiet Luxury trong re-commerce là sự đầu tư vào khả năng tái sử dụng — và đó trùng khớp với sứ mệnh ModaMi: đồ cũ, gu mới, nhưng chuẩn mực thì mãi là chất.',
  },
  {
    id: 't002',
    title: 'Grunge 90s tái xuất: từ runway đến chợ đồ cũ — cách săn đúng “mảnh ghép”',
    dek: 'Checklist chọn denim, flannel và boots secondhand để tránh “cosplay” và giữ tính đương đại.',
    excerpt:
      'Grunge hôm nay là bản remix: layer thô nhưng silhouette sạch hơn. Đây là cách đọc tag và form khi săn đồ vintage.',
    topic: 'Style Guide',
    readTime: '7 phút đọc',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200',
    editorialSeries: 'Street Archive · Vol. 3',
    author: 'Minh Quân Vũ',
    authorRole: 'Senior Style Editor',
    authorBio: 'Phụ trách các series phối đồ từ kho Curator và street snap nội đô.',
    publishedAt: '2025-10-18',
    updatedAt: '2025-10-22',
    wordCount: 1180,
    readingLevel: 'medium',
    coverCaption: 'Denim wash & layer flannel — combo được tìm kiếm nhiều nhất trên ModaMi Q3.',
    tags: ['grunge', '90s', 'denim', 'layering', 'vintage-hunt'],
    keyTakeaways: [
      'Ưu tiên denim có wash tự nhiên, tránh rách “cụt” không có texture xung quanh.',
      'Flannel nên để làm lớp giữa — outer chọn dáng ngắn hơn một bậc để tránh nuốt dáng.',
      'Boots cổ thấp + đế cao su giúp cân bằng silhouette khi áo oversize.',
    ],
    sources: ['LFW street recap · SS26 (tổng hợp)', 'ModaMi Search Trends · keyword “flannel”'],
    body:
      'Grunge trở lại không phải để nhắc lại Seattle thập niên 90 nguyên bản, mà để mang tinh thần “chống chỉnh tề có chủ đích” vào dress code hiện đại.\n\n' +
      'Khi mua secondhand, hãy đối chiếu form hiện tại của bạn: vai áo có bị tràn quá không? Ống quần có đủ đứng để cân một chiếc parka dày? Nếu không, hãy chọn phiên bản “vintage nhẹ” — wash sạch, rách micro.\n\n' +
      'Phụ kiện: một chiếc thắt lưng da thật hoặc tote canvas sẽ neo outfit về phía đời thực hơn là sân khấu.\n\n' +
      'Cuối cùng, đừng quên: grunge đẹp nhất khi người mặc thoải mái — nếu phải chỉnh sửa liên tục trong ngày, đó là tín hiệu form chưa đúng.',
  },
  {
    id: 't003',
    title: 'Dopamine Dressing & tâm lý màu: áp dụng cho tủ đồ tái thương mại như thế nào?',
    dek: 'Màu kích thích serotonin — nhưng trên đồ cũ, cần thêm một lớp “kiểm chứng” tình trạng.',
    excerpt:
      'Từ nghiên cứu màu học ứng dụng đến gợi ý phối an toàn khi mua pre-loved có sắc độ cao.',
    topic: 'Tin mới',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200',
    editorialSeries: 'Mindful Wardrobe',
    author: 'Thảo Nguyễn',
    authorRole: 'Contributor · Behavioral Design',
    authorBio: 'Kết hợp tâm lý học hành vi với sustainable retail.',
    publishedAt: '2025-10-05',
    updatedAt: '2025-10-06',
    wordCount: 980,
    readingLevel: 'light',
    coverCaption: 'Sắc độ cao hoạt động tốt khi có một khối trung tính neo cân.',
    tags: ['dopamine-dressing', 'color-theory', 'pre-loved', 'wellbeing'],
    keyTakeaways: [
      'Quy tắc 60-30-10 vẫn hiệu quả: 60% nền trung tính, 30% tông ấm/lạnh, 10% accent.',
      'Đồ secondhand màu nổi: kiểm tra phai màu dưới ánh ngoài trời trước khi chốt.',
      'Một khăn lụa hoặc tất màu có thể thay cả outfit dưới góc nhìn dopamine.',
    ],
    sources: ['Pantone Fashion Color Report (tóm tắt)', 'PubMed · color & mood (popular science)'],
    body:
      'Dopamine dressing không bắt buộc bạn phải mặc cầu vồng từ đầu đến chân — đó là khả năng tạo “cực tích cực” nhỏ trong ngày bằng một khối màu hoặc họa tiết khiến bạn tự tin hơn.\n\n' +
      'Với re-commerce, rủi ro lớn nhất là mua một món quá “nặng sắc” so với phần còn lại của tủ đồ. Hãy thử digital wardrobe (ảnh flatlay) trước khi nhấn mua — ModaMi đang thử nghiệm tính năng gợi ý mix màu dựa trên các listing đã lưu.\n\n' +
      'Nếu bạn mới thử: bắt đầu từ phụ kiện — mũ bucket, khăn vuông, tất cổ cao — để kiểm chứng mức độ phù hợp với gu cá nhân.\n\n' +
      'Kết: màu là công cụ cảm xúc; đồ cũ là lựa chọn có trách nhiệm — kết hợp cả hai tạo một gu bền vững mà vẫn vui mắt.',
  },
  {
    id: 't004',
    title: 'Capsule 2025: mười “trụ cột” trong tủ đồ re-commerce — checklist Curator',
    dek: 'Danh mục tối thiểu để mix 30+ outfit mà không cần mua mới liên tục.',
    excerpt:
      'Từ sơ mi trắng đến blazer xám: thứ tự ưu tiên khi săn secondhand và mức độ ưu tiên bảo dưỡng.',
    topic: 'Mua sắm',
    readTime: '9 phút đọc',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
    editorialSeries: 'Buyer Playbook',
    author: 'ModaMi Editorial',
    authorRole: 'Collective',
    authorBio: 'Biên tập bởi nhóm Curator & data sản phẩm ModaMi.',
    publishedAt: '2025-09-20',
    updatedAt: '2025-11-01',
    wordCount: 1650,
    readingLevel: 'medium',
    coverCaption: 'Flatlay minh họa — các nhóm màu trung tính dễ luân chuyển giữa các mùa.',
    tags: ['capsule-wardrobe', 'checklist', 'minimal', 'investment'],
    keyTakeaways: [
      'Ưu tiên 5 món “đỉnh vai”: sơ mi trắng, quần denim đúng form, blazer, knit mỏng, giày da/sneaker trắng.',
      'Mỗi món nên có ít nhất hai ngữ cảnh mặc (công sở + casual) mới đủ điểm vào capsule.',
      'Bảo dưỡng định kỳ > mua thêm: giày resole, áo len depilling giữ tuổi thọ item.',
    ],
    sources: ['UNEP · fashion waste factsheet', 'ModaMi SKU longevity survey · draft'],
    body:
      'Capsule wardrobe không phải là tủ đồ tẻ nhạt — đó là một hệ phương trình có nghiệm: mỗi món phải có khả năng kết nối với ít nhất ba món khác.\n\n' +
      'Trên ModaMi, chúng tôi khuyến nghị bắt đầu từ “xương sống màu”: một nhóm trung tính lạnh và một nhóm ấm — sau đó mới thêm một nhóm accent (đỏ gạch, xanh bottle…).\n\n' +
      'Với blazer secondhand, hãy kiểm tra vai áo và nách: hai điểm này khó sửa đẹp. Với denim, ưu tiên wash đồng đều và đường may còn chắc ở túi sau.\n\n' +
      'Phần giày: nếu đế mòn không đều, cân nhắc resole trước khi từ bỏ — đó là cách kéo dài vòng đời sản phẩm theo đúng tinh thần re-commerce.\n\n' +
      'Tổng kết: capsule 2025 là capsule “có số liệu” — bạn biết mình mặc gì, vì sao, và món đó đứng ở đâu trong hệ. Khi đó, mua thêm chỉ là bổ sung có chủ đích, không phải vá lỗ hổng cảm xúc.',
  },
];
