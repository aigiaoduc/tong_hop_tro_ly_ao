import { SHEET_CONFIG, IS_DEMO_MODE } from '../config';
import { AppItem, CourseItem, MembershipItem, User, ConfigMap, OpenMode } from '../types';

// Hàm hỗ trợ parse TSV cơ bản
const parseTSV = (text: string): string[][] => {
  const lines = text.split(/\r\n|\n/);
  return lines.map(line => line.split('\t').map(cell => cell.trim()));
};

// Hàm helper để xác định cách mở
const getOpenMode = (value: string): OpenMode => {
  if (!value) return 'new_tab';
  const v = value.toLowerCase();
  // Nếu ghi là iframe, nhúng, embed, nội bộ -> Iframe
  if (v.includes('iframe') || v.includes('nhúng') || v.includes('embed') || v.includes('nội bộ')) {
    return 'iframe';
  }
  return 'new_tab';
};

// Mock Data cho chế độ Demo
const MOCK_FREE_APPS: AppItem[] = [
  { id: '1', name: 'Trò chơi PowerPoint', description: 'Game trắc nghiệm tương tác cho học sinh.', imageUrl: 'https://picsum.photos/400/300?random=1', link: 'https://google.com', type: 'Miễn phí', visible: true, openMode: 'new_tab' },
  { id: '4', name: 'Vòng quay may mắn (Nhúng)', description: 'Tạo vòng quay ngẫu nhiên (Demo Nhúng).', imageUrl: 'https://picsum.photos/400/300?random=5', link: 'https://www.wikipedia.org/', type: 'Miễn phí', visible: true, openMode: 'iframe' },
];

const MOCK_PAID_APPS: AppItem[] = [
  { id: '2', name: 'Sổ điểm điện tử', description: 'Quản lý điểm số tự động, xuất báo cáo.', imageUrl: 'https://picsum.photos/400/300?random=2', link: 'https://google.com', type: 'Thu phí', visible: true, openMode: 'new_tab' },
  { id: '3', name: 'Công cụ Lên lịch báo giảng', description: 'Tự động lên lịch theo thời khóa biểu.', imageUrl: 'https://picsum.photos/400/300?random=3', link: 'https://google.com', type: 'Thu phí', visible: true, openMode: 'new_tab' },
];

const MOCK_COURSES: CourseItem[] = [
  { id: '1', name: 'Thành thạo PowerPoint trong 3 ngày', description: 'Học thiết kế slide chuyên nghiệp từ cơ bản đến nâng cao.', imageUrl: 'https://picsum.photos/400/300?random=4', price: '499.000 VNĐ', bankName: 'MB Bank', bankNumber: '0123456789', transferContent: 'KHOAHOC PPT SDT', visible: true, contentLink: 'https://youtube.com', openMode: 'new_tab', qrCodeUrl: 'https://img.vietqr.io/image/MB-0123456789-qr_only.png', zalo: '0909123456', facebook: 'https://facebook.com' },
  { id: '2', name: 'Kỹ năng quản lý lớp học (Miễn phí)', description: 'Chia sẻ kinh nghiệm quản lý lớp học hiệu quả.', imageUrl: 'https://picsum.photos/400/300?random=6', price: '0', bankName: '', bankNumber: '', transferContent: '', visible: true, contentLink: 'https://www.wikipedia.org/', openMode: 'iframe' },
];

const MOCK_MEMBERSHIPS: MembershipItem[] = [
  { id: '1', name: 'Thành viên VIP (1 Năm)', description: 'Truy cập tất cả ứng dụng thu phí trong 1 năm.', price: '200.000 VNĐ', bankName: 'MB Bank', bankNumber: '0123456789', transferContent: 'VIP 1NAM SDT', visible: true, benefits: ['Truy cập toàn bộ Apps', 'Hỗ trợ kỹ thuật 24/7'], isPopular: false, qrCodeUrl: 'https://img.vietqr.io/image/MB-0123456789-qr_only.png', zalo: '0909123456', facebook: 'https://facebook.com' },
  { id: '2', name: 'Thành viên Trọn đời', description: 'Sử dụng mãi mãi, update miễn phí.', price: '1.000.000 VNĐ', bankName: 'MB Bank', bankNumber: '0123456789', transferContent: 'VIP TRONDOI SDT', visible: true, benefits: ['Truy cập toàn bộ Apps', 'Hỗ trợ kỹ thuật trọn đời', 'Cập nhật tính năng sớm'], isPopular: true, qrCodeUrl: 'https://img.vietqr.io/image/MB-0123456789-qr_only.png', zalo: '0909123456', facebook: 'https://facebook.com' },
];

const MOCK_CONFIG: ConfigMap = {
  'tieu_de_web': 'Kho Tài Nguyên Thầy Quân',
  'email': 'lienhe@giaovien.com',
  'so_dien_thoai': '0909 123 456',
  'facebook': 'https://facebook.com',
  'youtube': 'https://youtube.com',
  'zalo': 'https://zalo.me',
  'footer_text': '© 2024 Kho Tài Nguyên Thầy Quân'
};

// --- FETCHING FUNCTIONS ---

export const fetchFreeApps = async (): Promise<AppItem[]> => {
  if (IS_DEMO_MODE || !SHEET_CONFIG.APPS_FREE_TSV.includes('http')) return MOCK_FREE_APPS;
  
  try {
    const response = await fetch(SHEET_CONFIG.APPS_FREE_TSV);
    const text = await response.text();
    const rows = parseTSV(text);
    return rows.slice(1).map(row => ({
      id: row[0],
      name: row[1],
      description: row[2],
      imageUrl: row[3],
      link: row[4],
      type: 'Miễn phí',
      visible: row[5]?.toLowerCase() === 'có' || row[5]?.toLowerCase() === 'true',
      openMode: getOpenMode(row[6]) // Cột thứ 7 (index 6)
    })).filter(item => item.id && item.visible);
  } catch (error) {
    console.error("Lỗi tải Free Apps:", error);
    return [];
  }
};

export const fetchPaidApps = async (): Promise<AppItem[]> => {
  if (IS_DEMO_MODE || !SHEET_CONFIG.APPS_PAID_TSV.includes('http')) return MOCK_PAID_APPS;
  
  try {
    const response = await fetch(SHEET_CONFIG.APPS_PAID_TSV);
    const text = await response.text();
    const rows = parseTSV(text);
    return rows.slice(1).map(row => ({
      id: row[0],
      name: row[1],
      description: row[2],
      imageUrl: row[3],
      link: row[4],
      type: 'Thu phí',
      visible: row[5]?.toLowerCase() === 'có' || row[5]?.toLowerCase() === 'true',
      openMode: getOpenMode(row[6]) // Cột thứ 7 (index 6)
    })).filter(item => item.id && item.visible);
  } catch (error) {
    console.error("Lỗi tải Paid Apps:", error);
    return [];
  }
};

export const fetchCourses = async (): Promise<CourseItem[]> => {
  if (IS_DEMO_MODE || !SHEET_CONFIG.COURSES_TSV.includes('http')) return MOCK_COURSES;

  try {
    const response = await fetch(SHEET_CONFIG.COURSES_TSV);
    const text = await response.text();
    const rows = parseTSV(text);
    return rows.slice(1).map(row => ({
      id: row[0],
      name: row[1],
      description: row[2],
      imageUrl: row[3],
      price: row[4],
      bankName: row[5],
      bankNumber: row[6],
      transferContent: row[7],
      visible: row[8]?.toLowerCase() === 'có' || row[8]?.toLowerCase() === 'true',
      contentLink: row[9] || '', // Cột thứ 10 là link bài học
      openMode: getOpenMode(row[10]), // Cột thứ 11 (index 10)
      qrCodeUrl: row[11] || '', // Cột thứ 12 (index 11): QR Code
      zalo: row[12] || '', // Cột thứ 13: Zalo
      facebook: row[13] || '' // Cột thứ 14: Facebook
    })).filter(item => item.id && item.visible);
  } catch (error) {
    console.error("Lỗi tải Courses:", error);
    return [];
  }
};

export const fetchMemberships = async (): Promise<MembershipItem[]> => {
  if (IS_DEMO_MODE || !SHEET_CONFIG.MEMBERSHIPS_TSV.includes('http')) return MOCK_MEMBERSHIPS;

  try {
    const response = await fetch(SHEET_CONFIG.MEMBERSHIPS_TSV);
    const text = await response.text();
    const rows = parseTSV(text);
    return rows.slice(1).map(row => {
      // Parse cột quyền lợi (Cột thứ 9, index 8)
      const benefitsStr = row[8] || '';
      const benefits = benefitsStr ? benefitsStr.split('|').map(s => s.trim()).filter(s => s.length > 0) : [];
      
      // Parse cột nổi bật (Cột thứ 10, index 9)
      const isPopularStr = row[9] || '';
      const isPopular = isPopularStr.toLowerCase() === 'có' || isPopularStr.toLowerCase() === 'true';

      return {
        id: row[0],
        name: row[1],
        description: row[2],
        price: row[3],
        bankName: row[4],
        bankNumber: row[5],
        transferContent: row[6],
        visible: row[7]?.toLowerCase() === 'có' || row[7]?.toLowerCase() === 'true',
        benefits: benefits,
        isPopular: isPopular,
        qrCodeUrl: row[10] || '', // Cột thứ 11 (index 10): QR Code
        zalo: row[11] || '', // Cột thứ 12: Zalo
        facebook: row[12] || '' // Cột thứ 13: Facebook
      };
    }).filter(item => item.id && item.visible);
  } catch (error) {
    console.error("Lỗi tải Memberships:", error);
    return [];
  }
};

export const fetchConfig = async (): Promise<ConfigMap> => {
  if (IS_DEMO_MODE || !SHEET_CONFIG.CONTACT_TSV.includes('http')) return MOCK_CONFIG;

  try {
    const response = await fetch(SHEET_CONFIG.CONTACT_TSV);
    const text = await response.text();
    const rows = parseTSV(text);
    const config: ConfigMap = {};
    rows.slice(1).forEach(row => {
      if (row[0] && row[1]) {
        config[row[0]] = row[1];
      }
    });
    return config;
  } catch (error) {
    console.error("Lỗi tải Config:", error);
    return {};
  }
};

export const authenticateUser = async (username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  if (IS_DEMO_MODE) {
    // Demo login: admin / admin
    if (username === 'admin' && password === 'admin') {
      return { 
        success: true, 
        user: { 
          username: 'admin', 
          fullName: 'Quản trị viên (Demo)', 
          expiryDate: '31/12/2099', 
          status: 'Hoạt động',
          purchasedCourseIds: ['ALL']
        } 
      };
    }
    return { success: false, message: 'Sai tài khoản hoặc mật khẩu demo (admin/admin)' };
  }

  try {
    const response = await fetch(SHEET_CONFIG.USERS_TSV);
    const text = await response.text();
    const rows = parseTSV(text);
    
    // Tìm user: Cột 0=User, 1=Pass, 2=Name, 3=Expiry, 4=Status, 5=PurchasedCourses
    const foundRow = rows.slice(1).find(row => row[0] === username && row[1] === password);
    
    if (!foundRow) {
      return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
    }

    const status = foundRow[4];
    if (status?.toLowerCase() !== 'hoạt động') {
      return { success: false, message: 'Tài khoản của bạn đang bị khóa.' };
    }

    const expiryStr = foundRow[3]; // dd/mm/yyyy
    const [day, month, year] = expiryStr.split('/').map(Number);
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      return { success: false, message: `Tài khoản đã hết hạn vào ngày ${expiryStr}. Vui lòng gia hạn.` };
    }

    // Parse khóa học đã mua (Cột thứ 6, index 5)
    let purchasedCourses: string[] = [];
    if (foundRow[5]) {
      // Tách theo dấu phẩy, xóa khoảng trắng thừa
      purchasedCourses = foundRow[5].split(',').map(id => id.trim());
    }

    return {
      success: true,
      user: {
        username: foundRow[0],
        fullName: foundRow[2],
        expiryDate: foundRow[3],
        status: status,
        purchasedCourseIds: purchasedCourses
      }
    };

  } catch (error) {
    console.error("Lỗi Login:", error);
    return { success: false, message: 'Lỗi kết nối đến máy chủ dữ liệu.' };
  }
};