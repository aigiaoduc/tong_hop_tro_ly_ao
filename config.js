/**
 * ==============================================================================
 * CẤU HÌNH KẾT NỐI HỆ THỐNG AI GIÁO DỤC (CONFIG.JS)
 * ==============================================================================
 * HƯỚNG DẪN DÀNH CHO THẦY QUÂN:
 * Sau khi triển khai (Deploy) xong đoạn mã trong thư mục `google-apps-script/Code.gs`,
 * Google sẽ cung cấp cho thầy 1 đường link dạng:
 * https://script.google.com/macros/s/AKfycb.../exec
 * 
 * Thầy chỉ cần copy link đó và dán vào biến `APPS_SCRIPT_URL` bên dưới:
 * ==============================================================================
 */

window.APP_CONFIG = {
  // 🔗 LINK GOOGLE APPS SCRIPT WEB APP (DÁN VÀO ĐÂY)
  // Lưu ý: Đảm bảo đuôi link kết thúc bằng /exec
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwrlUkkzdKBx40gCC9fxVZNeMyCtrX9KCEJCBVHGNZbECFb3CopN04l2H0pacMK9LOw9A/exec",

  // ⏱️ THỜI GIAN LƯU ĐỆM CACHE (Tính bằng phút)
  // Giúp website tải tức thì < 0.2s cho khách truy cập
  CACHE_EXPIRE_MINUTES: 15,

  // 🔄 TỰ ĐỘNG ĐẾM LƯỢT DÙNG VÀO GOOGLE SHEET (True = Bật, False = Tắt)
  TRACK_VIEWS_ENABLED: true,

  // 🛡️ CHẾ ĐỘ DỰ PHÒNG (True = Tự động dùng data.js nếu mất mạng hoặc Google nghẽn)
  FALLBACK_DATA_ENABLED: true,

  // ℹ️ THÔNG TIN HỖ TRỢ MẶC ĐỊNH
  DEFAULT_SUPPORT_ZALO: "0355213107",
  DEFAULT_AUTHOR_NAME: "Thầy Trần Hồng Quân"
};
