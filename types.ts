// Enum cho loại ứng dụng
export enum AppType {
  FREE = "Miễn phí",
  PAID = "Thu phí"
}

export type OpenMode = 'iframe' | 'new_tab';

// Interface cho Ứng dụng
export interface AppItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  link: string;
  type: string; // "Miễn phí" hoặc "Thu phí"
  visible: boolean;
  openMode: OpenMode; // "iframe" (nhúng) hoặc "new_tab" (tab mới)
}

// Interface cho Khóa học
export interface CourseItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  bankName: string;
  bankNumber: string;
  transferContent: string;
  visible: boolean;
  contentLink?: string; // Link đến nội dung khóa học (Youtube, Drive...)
  openMode: OpenMode; // "iframe" (nhúng) hoặc "new_tab" (tab mới)
  qrCodeUrl?: string; // Link ảnh QR Code ngân hàng
  zalo?: string; // Số điện thoại Zalo liên hệ
  facebook?: string; // Link Facebook liên hệ
}

// Interface cho Gói thành viên
export interface MembershipItem {
  id: string;
  name: string;
  description: string;
  price: string;
  bankName: string;
  bankNumber: string;
  transferContent: string;
  visible: boolean;
  benefits: string[]; // Danh sách quyền lợi (parse từ dấu |)
  isPopular: boolean; // Có phải gói nổi bật (Phổ biến nhất) không
  qrCodeUrl?: string; // Link ảnh QR Code ngân hàng
  zalo?: string; // Số điện thoại Zalo liên hệ
  facebook?: string; // Link Facebook liên hệ
}

// Interface cho Người dùng (Thành viên)
export interface User {
  username: string;
  password?: string; // Chỉ dùng khi check nội bộ, không lưu state
  fullName: string;
  expiryDate: string; // Format dd/mm/yyyy
  status: string; // "Hoạt động" hoặc "Khóa"
  purchasedCourseIds: string[]; // Danh sách ID khóa học đã mua
}

// Interface cho Cấu hình chung (Liên hệ)
export interface ContactConfig {
  key: string;
  value: string;
}

// Dictionary cấu hình để dễ truy xuất
export type ConfigMap = Record<string, string>;