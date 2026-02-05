# HƯỚNG DẪN CÀI ĐẶT BACKEND (HỆ THỐNG QUẢN TRỊ)

Đây là "bộ não" của website. Hãy làm theo đúng từng bước dưới đây.

## BƯỚC 1: TẠO GOOGLE SHEET (CƠ SỞ DỮ LIỆU)

1. Truy cập https://sheets.new để tạo file mới.
2. Đặt tên file là: **"Database Web Cá Nhân"**.
3. **Quan trọng:** Nhìn lên thanh địa chỉ trình duyệt, copy đoạn mã ID của Sheet.
   *   Ví dụ link là: `https://docs.google.com/spreadsheets/d/1abcXYZ-123456789/edit...`
   *   Thì ID là đoạn giữa: `1abcXYZ-123456789`
   *   *Lưu lại ID này để dùng ở Bước 2.*

4. Tạo **7 Sheet (Tab)** ở phía dưới và đổi tên thành Tiếng Việt chính xác như sau:

---

### Sheet 1: Tên là `Cấu hình`
Dùng để lưu thông tin cá nhân hiển thị trên web và **Phiên bản Dữ liệu**.
*   **Hàng 1 (Tiêu đề cột):** `Mã`, `Giá trị`, `Mô tả`
*   **Nhập dữ liệu mẫu:**
    *   `siteName` | `Trợ Lý Ảo` | Tên Website
    *   `name` | `Nguyễn Văn A` | Tên hiển thị
    *   ... (Các thông tin khác như cũ)
    *   **QUAN TRỌNG:** Thêm dòng mới: `DATA_VERSION` | `1.0` | Phiên bản dữ liệu (Tăng số này lên 1.1, 1.2... mỗi khi bạn cập nhật khóa học/app để web tải lại dữ liệu mới).

---

### Sheet 2: Tên là `Ứng dụng`
Danh sách các App/Tool bạn đã làm.
*   **Hàng 1 (Tiêu đề cột):** `ID`, `Tên ứng dụng`, `Mô tả ngắn`, `Mô tả chi tiết`, `Link sử dụng`, `Link ảnh`, `Chế độ mở`, `Trạng thái`
*   **Giải thích:**
    *   `Chế độ mở`: Điền `EMBED` (nếu muốn mở cửa sổ nhúng trong web) hoặc `NEW_TAB` (nếu muốn mở tab mới).
    *   `Trạng thái`: Nếu muốn ẩn ứng dụng này, điền `Ẩn`. Nếu muốn hiện, để trống hoặc điền `Hiện`.

---

### Sheet 3: Tên là `Khóa học`
Danh sách khóa học online.
*   **Hàng 1 (Tiêu đề cột):** `ID`, `Tên khóa học`, `Mô tả`, `Giá bán`, `Link Landing Page`, `Link nội dung`, `Link ảnh`, `Trạng thái`
*   **Giải thích:**
    *   `Trạng thái`: Điền `Ẩn` nếu muốn tạm dừng bán khóa học này.

---

### Sheet 4: Tên là `Phần mềm`
Danh sách phần mềm bán.
*   **Hàng 1 (Tiêu đề cột):** `ID`, `Tên phần mềm`, `Mô tả`, `Giá bán`, `Link Landing Page`, `Link nội dung`, `Link ảnh`, `Trạng thái`
*   **Giải thích:**
    *   `Trạng thái`: Điền `Ẩn` nếu muốn tạm ẩn phần mềm.

---

### Sheet 5: Tên là `Người dùng`
Lưu tài khoản khách hàng.
*   **Hàng 1 (Tiêu đề cột):** `Tài khoản`, `Mật khẩu`, `Họ tên`, `Email`, `Hạng thành viên`, `Sản phẩm đã mua`, `Trạng thái`
*   **Giải thích:**
    *   `Trạng thái`: Điền `Khóa` nếu muốn chặn người dùng này đăng nhập.

---

### Sheet 6: Tên là `Phản hồi`
*   **Hàng 1 (Tiêu đề cột):** `Thời gian`, `Họ tên`, `Email`, `Nội dung`

---

### Sheet 7: Tên là `Quảng cáo` (MỚI)
Dùng để cài đặt quảng cáo hiển thị ở Trang chủ.
*   **Hàng 1 (Tiêu đề cột):** `ID`, `Mô tả`, `Link ảnh`, `Link Landing Page`, `Trạng thái`
*   **Giải thích:**
    *   `Link Landing Page`: Là link sẽ được mở dạng Nhúng (Embed) khi người dùng bấm vào quảng cáo.
    *   `Trạng thái`: Điền `Ẩn` nếu không muốn hiện.

---

## BƯỚC 2: CÀI ĐẶT APPS SCRIPT (MÃ NGUỒN XỬ LÝ)

1. Tại file Google Sheet, chọn menu **Tiện ích mở rộng** > **Apps Script**.
2. Xóa sạch code cũ trong file `Mã.gs`.
3. Copy toàn bộ code bên dưới và dán vào.
4. **QUAN TRỌNG:** Tìm dòng đầu tiên `const SPREADSHEET_ID = '...';` và thay thế bằng ID Sheet bạn đã copy ở Bước 1.

```javascript
// =======================================================
// CẤU HÌNH ID GOOGLE SHEET CỦA BẠN (BẮT BUỘC THAY ĐỔI)
// =======================================================
const SPREADSHEET_ID = 'HAY_DAN_ID_SHEET_CUA_BAN_VAO_DAY'; 

// =======================================================
// CORE LOGIC - KHÔNG SỬA CODE BÊN DƯỚI NẾU KHÔNG HIỂU RÕ
// =======================================================

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  let result = { success: false, message: "Invalid action" };
  const action = e.parameter.action;
  
  let postData = {};
  if (e.postData && e.postData.contents) {
    try { postData = JSON.parse(e.postData.contents); } catch (err) {}
  }

  try {
    switch (action) {
      // READ PUBLIC
      case 'getConfig': result = getConfig(); break;
      case 'getApps': result = getApps(); break;
      case 'getCourses': result = getCourses(); break;
      case 'getSoftware': result = getSoftware(); break;
      case 'getAds': result = getAds(); break;
      
      // USER ACTIONS
      case 'register': result = registerUser(postData); break;
      case 'login': result = loginUser(postData); break;
      case 'submitFeedback': result = submitFeedback(postData); break;
      case 'registerFreeProduct': result = registerFreeProduct(postData); break; // MỚI: Đăng ký miễn phí

      // ADMIN ACTIONS
      case 'adminGetAllData': result = adminGetAllData(postData); break;
      case 'adminSaveItem': result = adminSaveItem(postData); break;
      case 'adminUpdateConfig': result = adminUpdateConfig(postData); break;
      
      default: result = { success: true, message: "Server Ready!" };
    }
  } catch (error) {
    result = { success: false, message: "Lỗi hệ thống: " + error.toString() };
  }
  
  output.setContent(JSON.stringify(result));
  return output;
}

// --- UTILS ---
function openSheet(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error("Không tìm thấy Sheet: " + name);
  return sheet;
}

function getSheetData(name) {
  const sheet = openSheet(name);
  const rows = sheet.getDataRange().getValues();
  return rows.length > 1 ? rows.slice(1) : [];
}

function isActive(status) {
  if (!status) return true;
  const s = String(status).toLowerCase().trim();
  return s !== 'ẩn' && s !== 'khóa' && s !== 'hide' && s !== 'lock';
}

// --- PUBLIC FUNCTIONS ---
function getConfig() {
  const rows = getSheetData('Cấu hình');
  const config = {};
  rows.forEach(row => { if(row[0]) config[row[0]] = row[1]; });
  return { success: true, data: config };
}

function getApps() {
  const rows = getSheetData('Ứng dụng');
  const data = rows.filter(r => isActive(r[7])).map(r => ({
    id: r[0], title: r[1], shortDesc: r[2], fullDesc: r[3], link: r[4], imageUrl: r[5], mode: r[6]
  }));
  return { success: true, data: data };
}

function getCourses() {
  const rows = getSheetData('Khóa học');
  const data = rows.filter(r => isActive(r[7])).map(r => ({
    id: r[0], title: r[1], description: r[2], price: Number(r[3]), landingPageUrl: r[4], contentLink: r[5], imageUrl: r[6], type: 'COURSE'
  }));
  return { success: true, data: data };
}

function getSoftware() {
  const rows = getSheetData('Phần mềm');
  const data = rows.filter(r => isActive(r[7])).map(r => ({
    id: r[0], title: r[1], description: r[2], price: Number(r[3]), landingPageUrl: r[4], contentLink: r[5], imageUrl: r[6], type: 'SOFTWARE'
  }));
  return { success: true, data: data };
}

function getAds() {
  const rows = getSheetData('Quảng cáo');
  const data = rows.filter(r => isActive(r[4])).map(r => ({
    id: r[0], title: r[1], imageUrl: r[2], landingPageUrl: r[3]
  }));
  return { success: true, data: data };
}

function registerUser(data) {
  const sheet = openSheet('Người dùng');
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.username)) return { success: false, message: "Tên đăng nhập đã tồn tại!" };
  }
  sheet.appendRow([data.username, data.password, data.fullName, data.email, 'MEMBER', '', '']);
  return { success: true, message: "Đăng ký thành công" };
}

function loginUser(data) {
  const rows = getSheetData('Người dùng');
  const userRow = rows.find(r => String(r[0]) === String(data.username) && String(r[1]) === String(data.password));
  if (userRow) {
    if (!isActive(userRow[6])) return { success: false, message: "Tài khoản bị khóa." };
    return {
      success: true,
      data: {
        username: userRow[0], fullName: userRow[2], email: userRow[3], membership: userRow[4], purchasedItems: userRow[5] ? String(userRow[5]).split(',') : []
      }
    };
  }
  return { success: false, message: "Sai tài khoản hoặc mật khẩu" };
}

function submitFeedback(data) {
  openSheet('Phản hồi').appendRow([new Date(), data.name, data.email, data.message]);
  return { success: true, message: "Đã gửi" };
}

// Hàm mới: Đăng ký sản phẩm miễn phí
function registerFreeProduct(data) {
  const username = data.username;
  const productId = data.productId;
  
  const sheet = openSheet('Người dùng');
  const rows = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  let currentItems = [];
  
  // Tìm người dùng
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(username)) {
      rowIndex = i + 1;
      // Cột "Sản phẩm đã mua" là cột thứ 6 (index 5)
      const itemsStr = String(rows[i][5]);
      currentItems = itemsStr ? itemsStr.split(',') : [];
      break;
    }
  }
  
  if (rowIndex === -1) return { success: false, message: "Không tìm thấy người dùng" };
  
  // Kiểm tra xem đã sở hữu chưa
  if (currentItems.includes(productId)) {
    return { success: true, message: "Đã sở hữu", data: currentItems };
  }
  
  // Kiểm tra giá sản phẩm (Bảo mật: Phải là 0đ)
  let isFree = false;
  
  // Check Course
  const courseRows = getSheetData('Khóa học');
  const course = courseRows.find(r => String(r[0]) === String(productId));
  if (course && Number(course[3]) === 0) isFree = true;
  
  // Check Software
  if (!isFree) {
    const softRows = getSheetData('Phần mềm');
    const soft = softRows.find(r => String(r[0]) === String(productId));
    if (soft && Number(soft[3]) === 0) isFree = true;
  }
  
  if (!isFree) return { success: false, message: "Sản phẩm này không miễn phí!" };
  
  // Thêm vào danh sách
  currentItems.push(productId);
  sheet.getRange(rowIndex, 6).setValue(currentItems.join(','));
  
  return { success: true, message: "Đăng ký thành công", data: currentItems };
}

// --- ADMIN FUNCTIONS ---

function adminGetAllData(data) {
  const sheetName = data.sheetName;
  const rows = getSheetData(sheetName);
  let mappedData = [];

  // Manual Mapping based on Sheet Structure defined in Step 1
  if (sheetName === 'Ứng dụng') {
    mappedData = rows.map(r => ({id: r[0], title: r[1], shortDesc: r[2], fullDesc: r[3], link: r[4], imageUrl: r[5], mode: r[6], status: r[7]}));
  } else if (sheetName === 'Khóa học' || sheetName === 'Phần mềm') {
    mappedData = rows.map(r => ({id: r[0], title: r[1], description: r[2], price: r[3], landingPageUrl: r[4], contentLink: r[5], imageUrl: r[6], status: r[7]}));
  } else if (sheetName === 'Quảng cáo') {
    mappedData = rows.map(r => ({id: r[0], title: r[1], imageUrl: r[2], landingPageUrl: r[3], status: r[4]}));
  } else if (sheetName === 'Người dùng') {
    mappedData = rows.map(r => ({username: r[0], password: r[1], fullName: r[2], email: r[3], membership: r[4], purchasedItems: r[5], status: r[6]}));
  } else if (sheetName === 'Phản hồi') {
    mappedData = rows.map(r => ({time: r[0], name: r[1], email: r[2], message: r[3]}));
  }

  return { success: true, data: mappedData };
}

function adminUpdateConfig(data) {
  const newConfig = data.config;
  const sheet = openSheet('Cấu hình');
  const rows = sheet.getDataRange().getValues();
  
  // Update each key if found
  for (let i = 1; i < rows.length; i++) {
    const key = rows[i][0];
    if (newConfig[key] !== undefined) {
      sheet.getRange(i + 1, 2).setValue(newConfig[key]);
    }
  }
  return { success: true, message: "Đã cập nhật cấu hình" };
}

function adminSaveItem(data) {
  const sheetName = data.sheetName;
  const item = data.item;
  const sheet = openSheet(sheetName);
  const rows = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  const idColIndex = (sheetName === 'Người dùng') ? 0 : 0; // Username or ID is always col 0
  const idValue = (sheetName === 'Người dùng') ? item.username : item.id;

  // Find existing row
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idColIndex]) === String(idValue)) {
      rowIndex = i + 1;
      break;
    }
  }

  // Construct Row Data
  let rowData = [];
  if (sheetName === 'Ứng dụng') {
    rowData = [item.id, item.title, item.shortDesc, item.fullDesc, item.link, item.imageUrl, item.mode, item.status];
  } else if (sheetName === 'Khóa học' || sheetName === 'Phần mềm') {
    rowData = [item.id, item.title, item.description, item.price, item.landingPageUrl, item.contentLink, item.imageUrl, item.status];
  } else if (sheetName === 'Quảng cáo') {
    rowData = [item.id, item.title, item.imageUrl, item.landingPageUrl, item.status];
  } else if (sheetName === 'Người dùng') {
     // Be careful not to overwrite password if not provided (though Admin panel sends it)
     // Find old password if not changing
     let pwd = item.password;
     if (!pwd && rowIndex > -1) pwd = rows[rowIndex-1][1]; 
     rowData = [item.username, pwd, item.fullName, item.email, item.membership, item.purchasedItems, item.status];
  }

  if (rowIndex > -1) {
    // Update
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return { success: true, message: "Đã cập nhật" };
  } else {
    // Add New
    sheet.appendRow(rowData);
    return { success: true, message: "Đã thêm mới" };
  }
}
```

## BƯỚC 3: DEPLOY (Triển khai lại)

**LƯU Ý:** Do code Apps Script đã thay đổi, bạn phải deploy bản mới:
1. Nhấn nút **Triển khai (Deploy)** > **Quản lý các bản triển khai (Manage deployments)**.
2. Nhấn biểu tượng bút chì (Edit) -> Ở mục Phiên bản (Version), chọn **Phiên bản mới (New version)**.
3. Nhấn **Triển khai (Deploy)**.