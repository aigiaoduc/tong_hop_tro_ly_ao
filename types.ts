
export enum ProductType {
  COURSE = 'COURSE',
  SOFTWARE = 'SOFTWARE'
}

export interface Config {
  siteName: string;
  footerText: string;
  avatarUrl: string;
  name: string;
  bio: string;
  facebookUrl: string;
  zaloUrl: string;
  phone: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  qrImageUrl: string;
  youtubeUrl: string;
  [key: string]: string; // Allow dynamic indexing for forms
}

export interface AppItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  link: string;
  mode: 'EMBED' | 'NEW_TAB';
  imageUrl: string;
  status?: string; // For Admin
  usageCount?: number; // New: Lượt dùng
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  landingPageUrl: string;
  contentLink: string;
  imageUrl: string;
  type: ProductType;
  status?: string; // For Admin
  usageCount?: number; // New: Lượt mua
}

export interface User {
  username: string;
  password?: string; // Optional for admin view
  fullName: string;
  email: string;
  membership: string;
  purchasedItems: string[];
  status?: string; // For Admin locking
}

export interface AdItem {
  id: string;
  title: string;
  imageUrl: string;
  landingPageUrl: string;
  status?: string;
}

export interface FeedbackData {
  time?: string;
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}