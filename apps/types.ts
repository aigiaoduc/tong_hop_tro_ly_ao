
export enum AppType {
  FREE = 'FREE',
  PAID = 'PAID'
}

export enum AppStatus {
  ACTIVE = 'ACTIVE', // Đang hoạt động
  MAINTENANCE = 'MAINTENANCE', // Đang bảo trì
  INACTIVE = 'INACTIVE' // Ngưng hoạt động
}

export interface AppMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  type: AppType;
  status: AppStatus; // Thêm trạng thái vào metadata
  price?: number;
  icon: string;
  previewUrl: string;
  link: string;
  downloads: number;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  recommended?: boolean;
  color: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}
