/**
 * FILE CẤU HÌNH LIÊN KẾT GOOGLE SHEETS
 * ------------------------------------------------
 * Hướng dẫn:
 * 1. Tạo Google Sheet với các tab (sheet) theo đúng tên đề xuất bên dưới.
 * 2. Vào Tệp (File) -> Chia sẻ (Share) -> Công bố lên web (Publish to web).
 * 3. Chọn từng sheet và chọn định dạng là "Tab-separated values (.tsv)".
 * 4. Copy link dán vào các mục tương ứng dưới đây.
 */

export const SHEET_CONFIG = {
  // Tab 1: "Ứng dụng Miễn phí"
  // Cột: ID, Tên ứng dụng, Mô tả, Link ảnh, Link ứng dụng, Hiển thị (Có/Không), CÁCH MỞ (Iframe/Tab)
  APPS_FREE_TSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGr7IYuzzbdJBwt5IIGD5KSphwYmoPpelnwnsHRsUJw-FzhIYynI1ego65Y5JlNfsncBsZ_jwZnppq/pub?gid=0&single=true&output=tsv",

  // Tab 2: "Ứng dụng Thu phí"
  // Cột: ID, Tên ứng dụng, Mô tả, Link ảnh, Link ứng dụng, Hiển thị (Có/Không), CÁCH MỞ (Iframe/Tab)
  APPS_PAID_TSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGr7IYuzzbdJBwt5IIGD5KSphwYmoPpelnwnsHRsUJw-FzhIYynI1ego65Y5JlNfsncBsZ_jwZnppq/pub?gid=1931301949&single=true&output=tsv",

  // Tab 3: "Khóa học"
  // Cột: ID, Tên khóa học, Mô tả, Link ảnh, Giá (Nhập '0' hoặc 'Miễn phí' để mở công khai), Ngân hàng, Số tài khoản, Nội dung chuyển khoản, Hiển thị, LINK BÀI HỌC, CÁCH MỞ (Iframe/Tab), LINK ẢNH QR, SỐ ZALO, LINK FACEBOOK
  COURSES_TSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGr7IYuzzbdJBwt5IIGD5KSphwYmoPpelnwnsHRsUJw-FzhIYynI1ego65Y5JlNfsncBsZ_jwZnppq/pub?gid=1094781106&single=true&output=tsv",

  // Tab 4: "Gói thành viên"
  // Cột: ID, Tên gói, Mô tả, Giá, Ngân hàng, Số tài khoản, Nội dung chuyển khoản, Hiển thị, QUYỀN LỢI (dấu |), NỔI BẬT (Có/Không), LINK ẢNH QR, SỐ ZALO, LINK FACEBOOK
  MEMBERSHIPS_TSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGr7IYuzzbdJBwt5IIGD5KSphwYmoPpelnwnsHRsUJw-FzhIYynI1ego65Y5JlNfsncBsZ_jwZnppq/pub?gid=777320729&single=true&output=tsv",

  // Tab 5: "Thành viên"
  // Cột: Tên đăng nhập, Mật khẩu, Họ tên, Ngày hết hạn (dd/mm/yyyy), Trạng thái (Hoạt động/Khóa), KHÓA HỌC ĐÃ MUA (ID cách nhau dấu phẩy hoặc 'ALL')
  USERS_TSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGr7IYuzzbdJBwt5IIGD5KSphwYmoPpelnwnsHRsUJw-FzhIYynI1ego65Y5JlNfsncBsZ_jwZnppq/pub?gid=1213940622&single=true&output=tsv",

  // Tab 6: "Cấu hình chung"
  // Cột: Mã, Giá trị
  // Các hàng gợi ý: email, so_dien_thoai, facebook, zalo, youtube
  CONTACT_TSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRGr7IYuzzbdJBwt5IIGD5KSphwYmoPpelnwnsHRsUJw-FzhIYynI1ego65Y5JlNfsncBsZ_jwZnppq/pub?gid=1088384583&single=true&output=tsv",
};

/**
 * CHẾ ĐỘ DEMO (MOCK DATA)
 * Nếu bạn chưa có link TSV, hãy đặt biến này là `true` để xem giao diện mẫu.
 * Khi đã có link, hãy đổi thành `false`.
 */
export const IS_DEMO_MODE = false;