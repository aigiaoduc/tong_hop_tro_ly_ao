
import { AppType, AppStatus, AppMetadata, MembershipTier, DashboardStat } from './types';

/**
 * =====================================================================
 * PHẦN 1: CẤU HÌNH CÁC ỨNG DỤNG (APPS)
 * =====================================================================
 * Hướng dẫn dành cho Thầy Quân:
 * - Thầy hãy đảm bảo các file App nằm trong thư mục: public/apps/tên_thư_mục/index.html
 */

// --- A. DANH SÁCH ỨNG DỤNG MIỄN PHÍ (FREE) ---
const FREE_APPS: AppMetadata[] = [
  {
    id: 'free_1',
    name: 'Trợ lý Soạn thảo AI Đa năng',
    description: 'Tự động hóa quy trình viết nội dung, email và bài liệu giảng dạy chuyên nghiệp.',
    category: 'AI Writing',
    type: AppType.FREE,
    status: AppStatus.ACTIVE,
    icon: 'Brain',
    previewUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    link: '/apps/writing-ai/index.html',
    downloads: 4500
  },
  {
    id: 'free_2',
    name: 'Trợ lý Code Thần tốc Pro',
    description: 'Hỗ trợ viết mã nguồn, sửa lỗi và tối ưu hóa chương trình đa ngôn ngữ.',
    category: 'AI Coding',
    type: AppType.FREE,
    status: AppStatus.MAINTENANCE,
    icon: 'Zap',
    previewUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    link: '/apps/coding-helper/index.html',
    downloads: 6780
  }
];

// --- B. DANH SÁCH ỨNG DỤNG TRẢ PHÍ (PAID - DÀNH CHO VIP) ---
const PAID_APPS: AppMetadata[] = [
  {
    id: 'paid_1',
    name: 'Phân tích Dữ liệu AI Chuyên sâu',
    description: 'Xử lý và trực quan hóa dữ liệu phức tạp chỉ bằng ngôn ngữ tự nhiên.',
    category: 'AI Analysis',
    type: AppType.PAID,
    status: AppStatus.ACTIVE,
    price: 19.99,
    icon: 'TrendingUp',
    previewUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80',
    link: '/apps/data-viz/index.html',
    downloads: 1245
  },
  {
    id: 'paid_2',
    name: 'Kiến trúc sư Hình ảnh Thế hệ mới',
    description: 'Tạo hình ảnh và bản vẽ kỹ thuật chất lượng cao từ mô tả văn bản.',
    category: 'AI Image',
    type: AppType.PAID,
    status: AppStatus.ACTIVE,
    price: 45.00,
    icon: 'Framer',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    link: '/apps/image-gen/index.html',
    downloads: 852
  },
  {
    id: 'paid_3',
    name: 'Gia sư Tiếng Anh AI Cao cấp',
    description: 'Luyện giao tiếp và sửa lỗi ngữ pháp theo thời gian thực với AI.',
    category: 'Education',
    type: AppType.PAID,
    status: AppStatus.INACTIVE,
    price: 9.99,
    icon: 'Brain',
    previewUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80',
    link: '/apps/english-tutor/index.html',
    downloads: 2310
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
