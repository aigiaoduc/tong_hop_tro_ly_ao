# HƯỚNG DẪN CÀI ĐẶT BACKEND (HỆ THỐNG QUẢN TRỊ RIÊNG BIỆT)

Hệ thống Admin giờ đây hoạt động độc lập trên Google Apps Script với giao diện chuyên nghiệp và bảo mật hơn.

## BƯỚC 1: CẬP NHẬT CODE.GS (Logic Xử Lý)

1. Truy cập vào dự án Apps Script của bạn.
2. Mở file **`Mã.gs` (hoặc `Code.gs`)**.
3. Xóa toàn bộ code cũ và thay thế bằng code dưới đây:

```javascript
// =======================================================
// CẤU HÌNH ID GOOGLE SHEET (BẠN PHẢI THAY ĐỔI DÒNG NÀY)
// =======================================================
const SPREADSHEET_ID = 'HAY_DAN_ID_SHEET_CUA_BAN_VAO_DAY'; 

// =======================================================
// CORE LOGIC
// =======================================================

function doGet(e) {
  // Nếu không có tham số 'action', hiển thị trang Admin Dashboard
  if (!e.parameter.action) {
    return HtmlService.createTemplateFromFile('Admin')
      .evaluate()
      .setTitle('Hệ Thống Quản Trị - Thầy Quân')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  // Nếu có 'action', trả về JSON API cho Website
  return handleRequest(e);
}

function doPost(e) { return handleRequest(e); }

// --- API HANDLER ---
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
      // PUBLIC READ
      case 'getConfig': result = getConfig(); break;
      case 'getApps': result = getApps(); break;
      case 'getCourses': result = getCourses(); break;
      case 'getSoftware': result = getSoftware(); break;
      case 'getAds': result = getAds(); break;
      
      // USER ACTIONS
      case 'register': result = registerUser(postData); break;
      case 'login': result = loginUser(postData); break;
      case 'submitFeedback': result = submitFeedback(postData); break;
      case 'registerFreeProduct': result = registerFreeProduct(postData); break;
      
      // ADMIN API (Called from React Admin if needed, though we use RPC mainly)
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

// --- RPC FUNCTIONS (Cho file Admin.html gọi trực tiếp) ---
function rpcGetAllData(sheetName) { return adminGetAllData({sheetName: sheetName}); }
function rpcSaveItem(sheetName, item) { return adminSaveItem({sheetName: sheetName, item: item}); }
function rpcUpdateConfig(config) { return adminUpdateConfig({config: config}); }
function rpcGetConfig() { return getConfig(); }

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

// --- LOGIC FUNCTIONS ---
function getConfig() {
  const rows = getSheetData('Cấu hình');
  const config = {};
  rows.forEach(row => { if(row[0]) config[row[0]] = row[1]; });
  // Versioning for cache busting
  config['DATA_VERSION'] = new Date().getTime().toString(); 
  return { success: true, data: config };
}

function getApps() {
  const rows = getSheetData('Ứng dụng');
  const data = rows.filter(r => isActive(r[7])).map(r => ({
    id: r[0], title: r[1], shortDesc: r[2], fullDesc: r[3], link: r[4], imageUrl: r[5], mode: r[6], usageCount: r[8] || 0
  }));
  return { success: true, data: data };
}

function getCourses() {
  const rows = getSheetData('Khóa học');
  const data = rows.filter(r => isActive(r[7])).map(r => ({
    id: r[0], title: r[1], description: r[2], price: Number(r[3]), landingPageUrl: r[4], contentLink: r[5], imageUrl: r[6], type: 'COURSE', usageCount: r[8] || 0
  }));
  return { success: true, data: data };
}

function getSoftware() {
  const rows = getSheetData('Phần mềm');
  const data = rows.filter(r => isActive(r[7])).map(r => ({
    id: r[0], title: r[1], description: r[2], price: Number(r[3]), landingPageUrl: r[4], contentLink: r[5], imageUrl: r[6], type: 'SOFTWARE', usageCount: r[8] || 0
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

function registerFreeProduct(data) {
  const username = data.username;
  const productId = data.productId;
  const sheet = openSheet('Người dùng');
  const rows = sheet.getDataRange().getValues();
  let rowIndex = -1;
  let currentItems = [];
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(username)) {
      rowIndex = i + 1;
      const itemsStr = String(rows[i][5]);
      currentItems = itemsStr ? itemsStr.split(',') : [];
      break;
    }
  }
  if (rowIndex === -1) return { success: false, message: "Không tìm thấy người dùng" };
  if (currentItems.includes(productId)) return { success: true, message: "Đã sở hữu", data: currentItems };
  
  // Check if free logic (Optional: can be stricter)
  currentItems.push(productId);
  sheet.getRange(rowIndex, 6).setValue(currentItems.join(','));
  return { success: true, message: "Đăng ký thành công", data: currentItems };
}

// --- ADMIN INTERNAL LOGIC ---

function adminGetAllData(data) {
  const sheetName = data.sheetName;
  const rows = getSheetData(sheetName);
  let mappedData = [];
  
  if (sheetName === 'Ứng dụng') {
    mappedData = rows.map(r => ({id: r[0], title: r[1], shortDesc: r[2], fullDesc: r[3], link: r[4], imageUrl: r[5], mode: r[6], status: r[7], usageCount: r[8]}));
  } else if (sheetName === 'Khóa học' || sheetName === 'Phần mềm') {
    mappedData = rows.map(r => ({id: r[0], title: r[1], description: r[2], price: r[3], landingPageUrl: r[4], contentLink: r[5], imageUrl: r[6], status: r[7], usageCount: r[8]}));
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
  for (let i = 1; i < rows.length; i++) {
    const key = rows[i][0];
    if (newConfig[key] !== undefined) sheet.getRange(i + 1, 2).setValue(newConfig[key]);
  }
  return { success: true, message: "Đã cập nhật cấu hình" };
}

function adminSaveItem(data) {
  const sheetName = data.sheetName;
  const item = data.item;
  const sheet = openSheet(sheetName);
  const rows = sheet.getDataRange().getValues();
  let rowIndex = -1;
  const idValue = (sheetName === 'Người dùng') ? item.username : item.id;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(idValue)) {
      rowIndex = i + 1;
      break;
    }
  }

  let rowData = [];
  // Ensure we map ALL columns correctly based on Sheet structure
  if (sheetName === 'Ứng dụng') {
    rowData = [item.id, item.title, item.shortDesc, item.fullDesc, item.link, item.imageUrl, item.mode, item.status, item.usageCount];
  } else if (sheetName === 'Khóa học' || sheetName === 'Phần mềm') {
    rowData = [item.id, item.title, item.description, item.price, item.landingPageUrl, item.contentLink, item.imageUrl, item.status, item.usageCount];
  } else if (sheetName === 'Quảng cáo') {
    rowData = [item.id, item.title, item.imageUrl, item.landingPageUrl, item.status];
  } else if (sheetName === 'Người dùng') {
     let pwd = item.password;
     if (!pwd && rowIndex > -1) pwd = rows[rowIndex-1][1]; 
     rowData = [item.username, pwd, item.fullName, item.email, item.membership, item.purchasedItems, item.status];
  }

  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return { success: true, message: "Đã cập nhật" };
  } else {
    sheet.appendRow(rowData);
    return { success: true, message: "Đã thêm mới" };
  }
}
```

## BƯỚC 2: CẬP NHẬT GIAO DIỆN ADMIN (Admin.html)

1. Trong dự án Apps Script, mở file **`Admin.html`**.
2. Xóa hết code cũ và dán toàn bộ code mới này vào:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <base target="_top">
  <meta charset="UTF-8">
  <title>Admin Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="//unpkg.com/alpinejs" defer></script>
  <!-- Icon Library -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    [x-cloak] { display: none !important; }
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
  </style>
</head>
<body class="bg-gray-100 text-gray-800" x-data="adminApp()" x-init="init()">

  <!-- 1. LOGIN SCREEN -->
  <div x-show="!isLoggedIn" class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-purple-800">
     <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all hover:scale-105 duration-300">
        <div class="text-center mb-8">
           <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full text-indigo-600 mb-4">
              <i data-lucide="shield-check" class="w-8 h-8"></i>
           </div>
           <h2 class="text-2xl font-bold text-gray-900">Quản Trị Viên</h2>
           <p class="text-gray-500 text-sm mt-1">Đăng nhập để quản lý hệ thống</p>
        </div>
        
        <input type="password" x-model="password" placeholder="Nhập mật khẩu (Mặc định: admin123)" 
          class="w-full border border-gray-300 px-4 py-3 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          @keyup.enter="login">
          
        <button @click="login" 
          class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2">
          <span>Truy cập</span> <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
        
        <p x-show="loginError" class="text-red-500 text-sm mt-4 text-center bg-red-50 py-2 rounded-lg border border-red-100 animate-pulse">
           Mật khẩu không đúng!
        </p>
     </div>
  </div>

  <!-- 2. DASHBOARD -->
  <div x-show="isLoggedIn" x-cloak class="flex h-screen overflow-hidden">
    
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-xl z-20 flex flex-col hidden md:flex">
       <div class="p-6 border-b border-gray-100 flex items-center gap-3">
          <div class="bg-indigo-600 text-white p-2 rounded-lg">
             <i data-lucide="layout-dashboard" class="w-6 h-6"></i>
          </div>
          <div>
             <h1 class="font-bold text-gray-800">Admin Panel</h1>
             <p class="text-xs text-green-600 font-medium">● Đang hoạt động</p>
          </div>
       </div>
       
       <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <template x-for="tab in tabs">
             <button @click="switchTab(tab.id)" 
                :class="activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                class="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group">
                <i :data-lucide="tab.icon" class="w-5 h-5 transition-colors" :class="activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'"></i>
                <span x-text="tab.label"></span>
             </button>
          </template>
       </nav>

       <div class="p-4 border-t border-gray-100">
          <button @click="logout" class="w-full flex items-center gap-2 text-gray-500 hover:text-red-600 px-4 py-2 transition text-sm font-medium">
             <i data-lucide="log-out" class="w-4 h-4"></i> Đăng xuất
          </button>
       </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
       <!-- Header Mobile -->
       <div class="md:hidden bg-white p-4 shadow flex justify-between items-center z-10">
          <span class="font-bold text-indigo-700">Admin Panel</span>
          <button @click="logout" class="text-sm text-red-600">Thoát</button>
       </div>

       <!-- Toolbar -->
       <header class="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shrink-0">
          <div>
             <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span x-text="tabs.find(t=>t.id===activeTab).label"></span>
             </h2>
             <p class="text-sm text-gray-500 mt-1">Quản lý dữ liệu hệ thống của bạn</p>
          </div>
          
          <div class="flex gap-3">
             <button @click="loadData()" class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Làm mới">
                <i data-lucide="refresh-cw" class="w-5 h-5" :class="loading ? 'animate-spin' : ''"></i>
             </button>
             <button x-show="activeTab !== 'config' && activeTab !== 'feedback'" 
                @click="openModal('ADD')" 
                class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 font-medium transition-transform active:scale-95">
                <i data-lucide="plus" class="w-4 h-4"></i> Thêm mới
             </button>
          </div>
       </header>

       <!-- Content Scrollable -->
       <div class="flex-1 overflow-y-auto p-4 md:p-8">
          
          <!-- Loading State -->
          <div x-show="loading" class="flex flex-col items-center justify-center h-64 text-gray-400">
             <i data-lucide="loader-2" class="w-10 h-10 animate-spin mb-3 text-indigo-500"></i>
             <p>Đang tải dữ liệu...</p>
          </div>

          <!-- Data View -->
          <div x-show="!loading" class="animate-in fade-in duration-300">
             
             <!-- Config Form -->
             <div x-show="activeTab === 'config'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <template x-for="(value, key) in configData">
                      <div class="col-span-1" :class="(key === 'bio' || key === 'footerText') ? 'md:col-span-2' : ''">
                         <label class="block text-sm font-bold text-gray-700 mb-2 capitalize" x-text="formatConfigKey(key)"></label>
                         
                         <template x-if="key === 'bio' || key === 'footerText'">
                            <textarea x-model="configData[key]" rows="3" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"></textarea>
                         </template>
                         <template x-if="key !== 'bio' && key !== 'footerText'">
                            <input type="text" x-model="configData[key]" class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition">
                         </template>
                         
                         <p class="text-xs text-gray-400 mt-1" x-text="getConfigHelp(key)"></p>
                      </div>
                   </template>
                </div>
                <div class="mt-8 pt-6 border-t border-gray-100">
                   <button @click="saveConfig" class="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center justify-center gap-2">
                      <i data-lucide="save" class="w-4 h-4"></i> Lưu Cấu Hình
                   </button>
                </div>
             </div>

             <!-- Data Table -->
             <div x-show="activeTab !== 'config'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                   <table class="w-full text-sm text-left text-gray-500">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                         <tr>
                            <th class="px-6 py-4">ID / Tên</th>
                            <th class="px-6 py-4">Thông tin chính</th>
                            <th class="px-6 py-4">Chi tiết</th>
                            <th class="px-6 py-4 text-center">Trạng thái</th>
                            <th class="px-6 py-4 text-right">Hành động</th>
                         </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                         <template x-for="item in dataList" :key="item.id || item.username">
                            <tr class="hover:bg-gray-50 transition-colors">
                               <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" x-text="item.id || item.username || item.time"></td>
                               
                               <td class="px-6 py-4">
                                  <div class="flex items-center gap-3">
                                     <template x-if="item.imageUrl">
                                        <img :src="item.imageUrl" class="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50">
                                     </template>
                                     <div class="truncate max-w-[200px]" :title="item.title || item.fullName">
                                        <div class="font-bold text-gray-800" x-text="item.title || item.fullName || item.name"></div>
                                        <div class="text-xs text-gray-400" x-text="item.email || (item.price ? new Intl.NumberFormat().format(item.price)+' đ' : '')"></div>
                                     </div>
                                  </div>
                               </td>

                               <td class="px-6 py-4 max-w-xs truncate text-gray-500" x-text="item.shortDesc || item.message || item.link || item.landingPageUrl"></td>
                               
                               <td class="px-6 py-4 text-center">
                                  <template x-if="item.status !== undefined">
                                     <span class="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 border"
                                        :class="(item.status === 'Ẩn' || item.status === 'Khóa') ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-green-50 text-green-700 border-green-100'">
                                        <span class="w-1.5 h-1.5 rounded-full" :class="(item.status === 'Ẩn' || item.status === 'Khóa') ? 'bg-gray-400' : 'bg-green-500'"></span>
                                        <span x-text="(item.status === 'Ẩn' || item.status === 'Khóa') ? (activeTab==='users'?'Đã Khóa':'Đang Ẩn') : (activeTab==='users'?'Hoạt động':'Hiển thị')"></span>
                                     </span>
                                  </template>
                               </td>
                               
                               <td class="px-6 py-4 text-right">
                                  <div class="flex items-center justify-end gap-2">
                                     <button @click="openModal('EDIT', item)" class="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition" title="Sửa">
                                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                                     </button>
                                  </div>
                               </td>
                            </tr>
                         </template>
                         <tr x-show="dataList.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-400">
                               <div class="flex flex-col items-center">
                                  <i data-lucide="inbox" class="w-12 h-12 mb-2 opacity-20"></i>
                                  <span>Chưa có dữ liệu nào</span>
                               </div>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
       </div>
    </main>

    <!-- 3. MODAL (ADD / EDIT) -->
    <div x-show="showModal" x-cloak 
       class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
       x-transition:enter="transition ease-out duration-300"
       x-transition:enter-start="opacity-0"
       x-transition:enter-end="opacity-100"
       x-transition:leave="transition ease-in duration-200"
       x-transition:leave-start="opacity-100"
       x-transition:leave-end="opacity-0">
       
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden"
          @click.away="showModal = false"
          x-transition:enter="transition ease-out duration-300"
          x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100">
          
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <h3 class="font-bold text-lg text-gray-800 flex items-center gap-2">
                <i :data-lucide="modalMode === 'ADD' ? 'plus-circle' : 'edit'" class="w-5 h-5 text-indigo-600"></i>
                <span x-text="modalMode === 'ADD' ? 'Thêm Mới' : 'Chỉnh Sửa Thông Tin'"></span>
             </h3>
             <button @click="showModal = false" class="text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 p-2 rounded-full transition">
                <i data-lucide="x" class="w-5 h-5"></i>
             </button>
          </div>
          
          <div class="p-6 overflow-y-auto space-y-5">
             <template x-for="field in getFields()">
                <div>
                   <label class="block text-sm font-bold text-gray-700 mb-1" x-text="field.label"></label>
                   
                   <!-- Textarea -->
                   <template x-if="field.type === 'textarea'">
                      <textarea x-model="currentItem[field.key]" rows="3" 
                         class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"></textarea>
                   </template>

                   <!-- Select Box -->
                   <template x-if="field.type === 'select'">
                      <div class="relative">
                         <select x-model="currentItem[field.key]" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none cursor-pointer">
                            <template x-for="opt in field.options">
                               <option :value="opt.value || opt" x-text="opt.label || opt"></option>
                            </template>
                         </select>
                         <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                            <i data-lucide="chevron-down" class="w-4 h-4"></i>
                         </div>
                      </div>
                   </template>

                   <!-- Input Text/Number -->
                   <template x-if="field.type === 'text' || field.type === 'number'">
                      <input :type="field.type" x-model="currentItem[field.key]" 
                         class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                         :class="(modalMode === 'EDIT' && (field.key === 'id' || field.key === 'username')) ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''"
                         :readonly="modalMode === 'EDIT' && (field.key === 'id' || field.key === 'username')">
                   </template>

                   <p class="text-xs text-gray-400 mt-1 italic flex items-center gap-1">
                      <i data-lucide="info" class="w-3 h-3"></i> <span x-text="field.help"></span>
                   </p>
                </div>
             </template>
          </div>
          
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
             <button @click="showModal = false" class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm font-medium transition">
                Hủy bỏ
             </button>
             <button @click="saveItem" class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold shadow-lg shadow-indigo-200 transition flex items-center gap-2">
                <i data-lucide="check" class="w-4 h-4"></i> Lưu thay đổi
             </button>
          </div>
       </div>
    </div>

  </div>

  <script>
    // --- FIELD CONFIGURATION ---
    // Định nghĩa cấu trúc các trường nhập liệu cho từng Tab
    const FIELD_CONFIG = {
       apps: [
          { key: 'id', label: 'Mã App (Duy nhất)', type: 'text', help: 'Ví dụ: APP01, TOOL_AI...' },
          { key: 'title', label: 'Tên Ứng dụng', type: 'text', help: 'Tên hiển thị trên thẻ.' },
          { key: 'imageUrl', label: 'Link Ảnh', type: 'text', help: 'URL ảnh đại diện (Imgur, Cloudinary...)' },
          { key: 'link', label: 'Link App', type: 'text', help: 'Đường dẫn đến web app cần chạy.' },
          { key: 'mode', label: 'Chế độ mở', type: 'select', options: [{value:'EMBED', label:'Nhúng (Popup)'}, {value:'NEW_TAB', label:'Mở Tab Mới'}], help: 'Chọn cách mở ứng dụng.' },
          { key: 'shortDesc', label: 'Mô tả ngắn', type: 'textarea', help: 'Mô tả hiển thị ở danh sách bên ngoài.' },
          { key: 'fullDesc', label: 'Mô tả chi tiết', type: 'textarea', help: 'Mô tả đầy đủ trong popup giới thiệu.' },
          { key: 'usageCount', label: 'Lượt dùng (Fake)', type: 'number', help: 'Số lượng người dùng hiển thị.' },
          { key: 'status', label: 'Trạng thái', type: 'select', options: ['Hiện', 'Ẩn'], help: 'Ẩn hoặc hiện ứng dụng này.' }
       ],
       courses: [
          { key: 'id', label: 'Mã Khóa học', type: 'text', help: 'Ví dụ: KH_REACT, KH_PYTHON...' },
          { key: 'title', label: 'Tên Khóa học', type: 'text', help: 'Tiêu đề khóa học.' },
          { key: 'price', label: 'Giá tiền (VNĐ)', type: 'number', help: 'Nhập 0 nếu miễn phí.' },
          { key: 'description', label: 'Mô tả', type: 'textarea', help: 'Giới thiệu nội dung khóa học.' },
          { key: 'landingPageUrl', label: 'Link Giới thiệu', type: 'text', help: 'Link video Youtube hoặc trang landing page.' },
          { key: 'contentLink', label: 'Link Bài học', type: 'text', help: 'Link Playlist hoặc Drive (Chỉ hiện khi đã mua).' },
          { key: 'imageUrl', label: 'Link Ảnh bìa', type: 'text', help: 'URL ảnh thumb.' },
          { key: 'usageCount', label: 'Số học viên', type: 'number', help: 'Số lượng người học hiển thị.' },
          { key: 'status', label: 'Trạng thái', type: 'select', options: ['Hiện', 'Ẩn'], help: 'Ẩn hoặc hiện khóa học này.' }
       ],
       software: [
          { key: 'id', label: 'Mã Phần mềm', type: 'text', help: 'Ví dụ: SOFT_01...' },
          { key: 'title', label: 'Tên Phần mềm', type: 'text', help: 'Tiêu đề phần mềm.' },
          { key: 'price', label: 'Giá tiền (VNĐ)', type: 'number', help: 'Nhập 0 nếu miễn phí.' },
          { key: 'description', label: 'Mô tả', type: 'textarea', help: 'Giới thiệu tính năng.' },
          { key: 'landingPageUrl', label: 'Link Giới thiệu', type: 'text', help: 'Link video review hoặc trang chủ.' },
          { key: 'contentLink', label: 'Link Tải về', type: 'text', help: 'Link Google Drive hoặc Fshare (Chỉ hiện khi đã mua).' },
          { key: 'imageUrl', label: 'Link Ảnh bìa', type: 'text', help: 'URL ảnh minh họa.' },
          { key: 'usageCount', label: 'Lượt tải', type: 'number', help: 'Số lượng người tải hiển thị.' },
          { key: 'status', label: 'Trạng thái', type: 'select', options: ['Hiện', 'Ẩn'], help: 'Ẩn hoặc hiện phần mềm này.' }
       ],
       users: [
          { key: 'username', label: 'Tên đăng nhập', type: 'text', help: 'Không thể sửa sau khi tạo.' },
          { key: 'password', label: 'Mật khẩu', type: 'text', help: 'Nhập để đổi mật khẩu (Chỉ admin).' },
          { key: 'fullName', label: 'Họ và tên', type: 'text', help: 'Tên hiển thị của thành viên.' },
          { key: 'email', label: 'Email', type: 'text', help: 'Email liên hệ.' },
          { key: 'membership', label: 'Hạng thành viên', type: 'text', help: 'VD: MEMBER, VIP, ADMIN.' },
          { key: 'status', label: 'Trạng thái', type: 'select', options: [{value:'', label:'Hoạt động'}, {value:'Khóa', label:'Đã khóa'}], help: 'Khóa tài khoản nếu vi phạm.' }
       ],
       ads: [
          { key: 'id', label: 'Mã QC', type: 'text', help: 'VD: AD_01' },
          { key: 'title', label: 'Tiêu đề QC', type: 'text', help: 'Tiêu đề hiển thị nhỏ.' },
          { key: 'imageUrl', label: 'Link Ảnh Banner', type: 'text', help: 'Ảnh dọc hoặc vuông.' },
          { key: 'landingPageUrl', label: 'Link Đích', type: 'text', help: 'Link mở ra khi bấm vào QC.' },
          { key: 'status', label: 'Trạng thái', type: 'select', options: ['Hiện', 'Ẩn'], help: 'Bật/Tắt quảng cáo này.' }
       ]
    };

    function adminApp() {
      return {
        isLoggedIn: false,
        password: '',
        loginError: false,
        activeTab: 'config',
        loading: false,
        dataList: [],
        configData: {},
        showModal: false,
        modalMode: 'ADD',
        currentItem: {},
        
        tabs: [
           {id: 'config', label: 'Cấu hình chung', icon: 'settings'},
           {id: 'apps', label: 'Ứng dụng', icon: 'layout-grid'},
           {id: 'courses', label: 'Khóa học', icon: 'graduation-cap'},
           {id: 'software', label: 'Phần mềm', icon: 'monitor'},
           {id: 'ads', label: 'Quảng cáo', icon: 'megaphone'},
           {id: 'users', label: 'Người dùng', icon: 'users'},
        ],

        init() {
           // Auto refresh icons
           this.$watch('activeTab', () => setTimeout(() => lucide.createIcons(), 100));
           this.$watch('loading', () => setTimeout(() => lucide.createIcons(), 100));
           this.$watch('isLoggedIn', () => setTimeout(() => lucide.createIcons(), 100));
        },

        login() {
           if(this.password === 'admin123') { // Mật khẩu mặc định
              this.isLoggedIn = true; 
              this.loadData();
           } else {
              this.loginError = true;
              setTimeout(() => this.loginError = false, 2000);
           }
        },

        logout() {
           this.isLoggedIn = false;
           this.password = '';
        },

        switchTab(id) {
           this.activeTab = id;
           this.loadData();
        },

        loadData() {
           this.loading = true;
           if(this.activeTab === 'config') {
              google.script.run.withSuccessHandler(res => {
                 if(res.success) this.configData = res.data;
                 this.loading = false;
              }).rpcGetConfig();
           } else {
              const sheetMap = {apps: 'Ứng dụng', courses: 'Khóa học', software: 'Phần mềm', users: 'Người dùng', ads: 'Quảng cáo'};
              google.script.run.withSuccessHandler(res => {
                 this.dataList = res.success ? res.data : [];
                 this.loading = false;
              }).rpcGetAllData(sheetMap[this.activeTab]);
           }
        },

        openModal(mode, item = {}) {
           this.modalMode = mode;
           this.currentItem = mode === 'ADD' ? {} : {...item};
           
           // Default values for ADD
           if(mode === 'ADD') {
              if(this.activeTab !== 'users') this.currentItem.status = 'Hiện';
              if(this.activeTab === 'apps') this.currentItem.mode = 'EMBED';
           }
           this.showModal = true;
           setTimeout(() => lucide.createIcons(), 50);
        },

        saveItem() {
           this.loading = true;
           this.showModal = false;
           const sheetMap = {apps: 'Ứng dụng', courses: 'Khóa học', software: 'Phần mềm', users: 'Người dùng', ads: 'Quảng cáo'};
           google.script.run.withSuccessHandler(res => {
              alert(res.message);
              this.loadData();
           }).rpcSaveItem(sheetMap[this.activeTab], this.currentItem);
        },

        saveConfig() {
           this.loading = true;
           google.script.run.withSuccessHandler(res => {
              alert(res.message);
              this.loading = false;
           }).rpcUpdateConfig(this.configData);
        },

        getFields() {
           return FIELD_CONFIG[this.activeTab] || [];
        },

        // Helpers for Config Labels
        formatConfigKey(key) {
           const map = {
             siteName: 'Tên Website',
             footerText: 'Chữ chân trang',
             avatarUrl: 'Link Avatar',
             name: 'Tên hiển thị (Intro)',
             bio: 'Giới thiệu bản thân',
             facebookUrl: 'Link Facebook',
             zaloUrl: 'Link Zalo',
             youtubeUrl: 'Link Youtube',
             phone: 'Số điện thoại / Hotline',
             bankName: 'Tên Ngân hàng',
             bankAccountNo: 'Số tài khoản',
             bankAccountName: 'Chủ tài khoản',
             qrImageUrl: 'Link Ảnh QR Code'
           };
           return map[key] || key;
        },

        getConfigHelp(key) {
           const map = {
             avatarUrl: 'Nên dùng link ảnh vuông tỉ lệ 1:1',
             bio: 'Có thể xuống dòng',
             qrImageUrl: 'Nếu để trống sẽ tự tạo mã VietQR theo thông tin ngân hàng.'
           };
           return map[key] || '';
        }
      }
    }
  </script>
</body>
</html>
```

## BƯỚC 3: TRIỂN KHAI LẠI (DEPLOY)

Mỗi khi sửa code Apps Script, bạn **BẮT BUỘC** phải Deploy lại phiên bản mới thì thay đổi mới có hiệu lực.

1. Nhấn nút **Deploy (Triển khai)** (màu xanh góc trên phải).
2. Chọn **Manage deployments (Quản lý triển khai)**.
3. Nhấn biểu tượng **Edit (Bút chì)** bên cạnh "Web App".
4. Ở phần **Version (Phiên bản)**, chọn **New version (Phiên bản mới)**.
5. Nhấn **Deploy**.

Sau khi deploy xong, bạn có thể truy cập lại link `/exec` của mình để thấy giao diện Admin mới!
