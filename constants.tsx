
import { AppType, AppStatus, AppMetadata, MembershipTier, DashboardStat } from './types';

/**
 * =====================================================================
 * PHẦN 1: CẤU HÌNH CÁC ỨNG DỤNG (APPS)
 * =====================================================================
 * Hướng dẫn dành cho Thầy Quân:
 * - Thầy có thể chỉnh sửa status: AppStatus.ACTIVE, MAINTENANCE, hoặc INACTIVE
 */

// --- A. DANH SÁCH ỨNG DỤNG MIỄN PHÍ (FREE) ---
const FREE_APPS: AppMetadata[] = [
  {
    id: 'free_1',
    name: 'Trợ lý tạo prompt năng lực số',
    description: 'Ứng dụng hỗ trợ giáo viên tạo Prompt tích hợp năng lực số vào phụ lục kế hoạch bài dạy chuyên nghiệp.',
    category: 'AI Prompt',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'Brain',
    previewUrl: 'https://spirit.vietnamairlines.com/wp-content/uploads/2024/01/1-3.png',
    link: 'apps/tro_ly_prompt_nang_luc_so/index.html',
    downloads: 4500
  },
  {
    id: 'free_2',
    name: 'Trợ lý Prompt Infographic giáo dục chuyên nghiệp',
    description: 'Hỗ trợ tạo prompt infographic giáo dục rõ ràng, trực quan và dễ áp dụng giảng dạy.',
    category: 'AI Prompt',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'TrendingUp',
    previewUrl: 'https://scottleroymarketing.com/wp-content/uploads/2016/06/infographic.png',
    link: 'apps/prompt_infographic/index.html',
    downloads: 6780
  },
  {
    id: 'free_3',
    name: 'Tạo ma trận đề kiểm tra AI nhanh chóng',
    description: 'Tự động xây dựng ma trận đề kiểm tra chính xác, tiết kiệm thời gian cho giáo viên.',
    category: 'Kiểm tra – đánh giá',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'Zap',
    previewUrl: 'https://scottleroymarketing.com/wp-content/uploads/2016/06/infographic.png',
    link: 'apps/ma_tran_de_kiem_tra/index.html',
    downloads: 8120
  },
  {
    id: 'free_4',
    name: 'Tạo ma trận đề kiểm tra AI nhanh chóng',
    description: 'Tự động xây dựng ma trận đề kiểm tra chính xác, tiết kiệm thời gian cho giáo viên.',
    category: 'Kiểm tra đánh giá',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'Zap',
    previewUrl: 'https://cdnv2.tgdd.vn/mwg-static/common/News/1575133/tao-de-thi-trac-nghiem-online%20%281%29.jpg',
    link: 'apps/ma_tran_de_kiem_tra/index.html',
    downloads: 3520
  },
  {
    id: 'free_5',
    name: 'Tạo đề kiểm tra bằng AI nhanh chóng',
    description: 'Hỗ trợ xây dựng đề kiểm tra nhanh chóng, đúng chuẩn kiến thức và phù hợp từng đối tượng học sinh.',
    category: 'Kiểm tra đánh giá',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'Zap',
    previewUrl: 'https://cdn.tgdd.vn/Files/2023/04/11/1524277/3-110423-093053-800-resize.jpg',
    link: 'apps/tao_de_kiem_tra/index.html',
    downloads: 2740
  },
  {
    id: 'free_6',
    name: 'Tạo sơ đồ tư duy bằng AI nhanh chóng',
    description: 'Giúp tạo sơ đồ tư duy trực quan, hệ thống kiến thức nhanh chóng và dễ ghi nhớ.',
    category: 'Phương pháp học tập',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'Network',
    previewUrl: 'https://cdn-media.sforum.vn/storage/app/media/ai-tao-mindmap-1.jpg',
    link: 'apps/tao_so_do_tu_duy/index.html',
    downloads: 1640
  },
  {
    id: 'free_7',
    name: 'Tạo mã QR chuyên nghiệp',
    description: 'Tạo mã QR nhanh gọn để chia sẻ tài liệu, bài học và liên kết giáo dục.',
    category: 'Tiện ích giáo dục',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'QrCode',
    previewUrl: 'https://assets.qrcode-ai.com/index/qrcode-ai-og-banner.png',
    link: 'apps/tao_ma_qr/index.html',
    downloads: 2890
  },
  {
    id: 'free_8',
    name: 'Trợ lý tạo trò chơi dạy học AI thông minh',
    description: 'Hỗ trợ thiết kế trò chơi học tập sinh động, tăng hứng thú và hiệu quả tiếp thu.',
    category: 'Tiện ích giáo dục',
    type: AppType.FREE,
    status: AppStatus.ACTIVE, // TRẠNG THÁI: ĐANG HOẠT ĐỘNG
    icon: 'Gamepad2',
    previewUrl: 'https://i1.wp.com/9to5google.com/wp-content/uploads/sites/4/2023/12/Google-write-image-prompts-game-3.jpg?ssl=1',
    link: 'apps/tro_ly_tao_tro_choi_day_hoc/index.html',
    downloads: 3210
  }
];

// --- B. DANH SÁCH ỨNG DỤNG TRẢ PHÍ (PAID - DÀNH CHO VIP) ---
const PAID_APPS: AppMetadata[] = [
  {
    id: 'paid_1',
    name: 'Tạo prompt Veo 3 chuyên nghiệp',
    description: 'Hỗ trợ viết prompt Veo 3 chuẩn xác để tạo video giáo dục chất lượng cao.',
    category: 'Sáng tạo nội dung số',
    type: AppType.PAID,
    status: AppStatus.ACTIVE,
    price: 19.99,
    icon: 'Video',
    previewUrl: 'https://vnpthcm.com/wp-content/uploads/2025/06/veo-3-ai-thumb.jpg',
    link: 'apps/paid_tao_prompt_veo3/index.html',
    downloads: 1950
  },
  {
    id: 'paid_2',
    name: 'Trợ lý xây dựng sáng kiến kinh nghiệm cho giáo viên',
    description: 'Hỗ trợ giáo viên xây dựng sáng kiến kinh nghiệm đúng quy định, trình bày mạch lạc và nâng cao khả năng đạt kết quả cao.',
    category: 'Nghiên cứu',
    type: AppType.PAID,
    status: AppStatus.MAINTENANCE, // TRẠNG THÁI: BẢO TRÌ
    price: 45.00,
    icon: 'FileText',
    previewUrl: 'https://media.vneconomy.vn/images/upload/2024/05/28/w-1920.jpg',
    link: 'apps/paid_tro_ly_viet_SKKN/index.html',
    downloads: 1340
  },
  {
    id: 'paid_3',
    name: 'Trợ lý viết phần thi biện pháp thi giáo viên giỏi',
    description: 'Hỗ trợ giáo viên viết biện pháp dự thi giáo viên giỏi logic, đúng tiêu chí và dễ đạt điểm cao.',
    category: 'Nghiên cứu',
    type: AppType.PAID,
    status: AppStatus.MAINTENANCE, // TRẠNG THÁI: BẢO TRÌ
    price: 45.00,
    icon: 'FileText',
    previewUrl: 'https://oes.vn/wp-content/uploads/2025/05/cong-cu-ai-danh-cho-giao-vien-5.jpg',
    link: 'apps/pain_tro_ly_bien_phap_gvg/index.html',
    downloads: 852
  }
];

export const APPS_DATA: AppMetadata[] = [...FREE_APPS, ...PAID_APPS];

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'free',
    name: 'Học viên',
    price: '0đ',
    period: '/ mãi mãi',
    features: [
      'Sử dụng toàn bộ kho App Miễn phí',
      'Hỗ trợ cộng đồng chung',
      'Cập nhật tin tức AI mới nhất',
      'Không giới hạn lượt dùng app free'
    ],
    color: 'border-slate-700'
  },
  {
    id: 'pro',
    name: 'Hội viên VIP',
    price: '200.000đ',
    period: '/ tháng',
    features: [
      'Mở khóa toàn bộ kho App Trả phí',
      'Cấp mã kích hoạt cá nhân (Key)',
      'Ưu tiên xử lý tốc độ cao',
      'Sử dụng các model AI cao cấp nhất',
      'Hỗ trợ cài đặt 1-1'
    ],
    recommended: true,
    color: 'border-indigo-500'
  },
  {
    id: 'custom',
    name: 'Thiết kế Theo yêu cầu',
    price: 'Liên hệ',
    period: 'Tư vấn 24/7',
    features: [
      'Viết App AI & Phần mềm riêng biệt',
      'Thiết kế Website, Công cụ dạy học',
      'Hỗ trợ Sáng kiến kinh nghiệm (SKKN)',
      'Làm Video AI & Hình ảnh chuyên nghiệp',
      'Bất kỳ yêu cầu kỹ thuật nào khác'
    ],
    color: 'border-fuchsia-500'
  }
];

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: 'Lượng truy cập', value: '105.4k', change: '+5.2%', isPositive: true },
  { label: 'Yêu cầu AI', value: '215k+', change: '+12.4%', isPositive: true },
  { label: 'Trợ lý sẵn có', value: '12', change: '+2', isPositive: true },
  { label: 'Độ chính xác', value: '99.1%', change: '+0.4%', isPositive: true },
];
