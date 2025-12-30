# Kho Tài Nguyên Thầy Quân

Dự án quản lý ứng dụng và khóa học, dữ liệu từ Google Sheets.

## Cài đặt và Chạy Development

1.  Cài đặt dependencies:
    ```bash
    npm install
    ```

2.  Chạy server dev:
    ```bash
    npm run dev
    ```

## Build cho Production (Vercel)

Dự án này sử dụng Vite để build.

1.  Lệnh build:
    ```bash
    npm run build
    ```

2.  Thư mục đầu ra: `dist`

## Cấu trúc thư mục

-   `manifest.json`, `sw.js`: Các file PWA (được copy thủ công vào dist khi build).
-   `config.ts`: Cấu hình link Google Sheets.
-   `index.html`: Entry point.
-   `src/*`: (Hiện tại code nằm ở root để đơn giản hóa, Vite config đã được chỉnh để hỗ trợ điều này).