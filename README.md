# HƯỚNG DẪN TRIỂN KHAI VÀ VẬN HÀNH WEBSITE AI GIÁO DỤC
**Tác giả & Bản quyền:** Thầy Trần Hồng Quân  
**Website:** [aigiaoduc.io.vn](https://aigiaoduc.io.vn/) | **Hotline/Zalo:** 0355.213.107 | **YouTube:** [@quanh95](https://www.youtube.com/@quanh95)

---

## 🌟 CÁC ĐIỂM CẬP NHẬT MỚI NHẤT

1. **Bảo Mật Đường Link Ứng Dụng**:
   - Đã bỏ hoàn toàn nút mở tab mới trong cửa sổ nhúng. Mọi ứng dụng được chạy bảo mật trực tiếp trên web, không làm lộ đường dẫn gốc của Thầy.
2. **Nút Mời Cà Phê / Ủng Hộ (Donate)**:
   - Được gắn ở **Thanh Menu đầu trang** và **Thanh công cụ trong cửa sổ nhúng**.
   - Tự động hiển thị mã VietQR chuyển khoản nhanh (Vietcombank - TRẦN HỒNG QUÂN).
3. **Sửa Dứt Điểm Nút Giao Diện Sáng / Tối**:
   - Khắc phục lỗi kẹt khi chuyển qua lại giữa chế độ Sáng và Tối, hoạt động trơn tru 100%.
4. **Bỏ Mục Khóa Học & Phần Mềm, Bổ Sung Mục "Video Bài Giảng"**:
   - Tích hợp mục Video chuyên nghiệp: xem trực tiếp video YouTube từ kênh Thầy Quân trên web mà không cần rời trang.
   - Thêm sheet `Video` vào cơ sở dữ liệu để Thầy dễ dàng thêm video mới bằng cách dán link YouTube.
5. **Mã Google Apps Script Tinh Gọn**:
   - File `google-apps-script/Code.gs` được giữ nguyên mã thuần túy, sạch sẽ, không chứa ghi chú rườm rà, Thầy chỉ cần Ctrl + A rồi Copy và dán.

---

## 📋 HƯỚNG DẪN TRIỂN KHAI NHANH

### Bước 1: Thiết Lập Google Sheet & Apps Script
1. Mở Google Sheet của Thầy (hoặc import file mẫu `Trợ lý ảo thầy Quân - v4_chuan_hoa.xlsx`).
   - Sheet này gồm: `Cấu hình`, `Ứng dụng`, `Video`, `Quảng cáo`, `Phản hồi`, `Người dùng`.
2. Vào menu **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
3. Mở file `google-apps-script/Code.gs`, copy toàn bộ mã và dán đè vào Apps Script. Bấm Lưu.
4. Bấm nút màu xanh **Triển khai** (Deploy) -> **Triển khai mới** (New deployment) -> Chọn **Ứng dụng web** (Web app):
   - Thực thi dưới dạng (Execute as): **Tôi (Me)**
   - Ai có quyền truy cập (Who has access): **Bất kỳ ai (Anyone)**
5. Bấm Triển khai và copy đường link Web App có đuôi `/exec`.

### Bước 2: Dán Link Vào File `config.js`
1. Mở file `config.js`.
2. Dán link Apps Script vào dòng:
   ```javascript
   APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
3. Lưu file lại.

### Bước 3: Đưa Lên Vercel
1. Đẩy thư mục `web-aigiaoduc` lên GitHub của Thầy.
2. Vào [vercel.com](https://vercel.com) chọn repository và bấm **Deploy**.
3. Thêm tên miền `aigiaoduc.io.vn` vào mục **Settings -> Domains** trên Vercel.
