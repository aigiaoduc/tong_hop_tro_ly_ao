// QUAN TRỌNG: Thay thế URL bên dưới bằng URL Web App của Google Apps Script sau khi bạn deploy
export const API_URL = 'https://script.google.com/macros/s/AKfycbzTXDIz_-btyKrN-ANN9c-1RtFzsq56UWkerBjPHl1UHZ9802M_Vh30envEfrRv6bfSmw/exec';

// Cấu hình ngân hàng mặc định (fallback nếu chưa load được từ Sheet)
export const DEFAULT_BANK_INFO = {
  BANK_ID: 'MB', // Ví dụ MBBank, VCB, ACB... (Theo chuẩn VietQR)
  ACCOUNT_NO: '0000000000',
  ACCOUNT_NAME: 'NGUYEN VAN A'
};

export const MOCK_DATA = false; // Đã chuyển thành FALSE để lấy dữ liệu thật từ Google Sheet