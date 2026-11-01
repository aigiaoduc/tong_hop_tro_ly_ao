const fs = require('fs');
const path = require('path');

let memoryCache = {
  data: null,
  timestamp: 0
};

function getAppsScriptUrl() {
  if (process.env.APPS_SCRIPT_URL && process.env.APPS_SCRIPT_URL.trim()) {
    return process.env.APPS_SCRIPT_URL.trim();
  }
  try {
    const configPath = path.join(__dirname, '..', 'config.js');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const match = content.match(/APPS_SCRIPT_URL\s*:\s*['"]([^'"]+)['"]/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (err) {
    console.error('Error reading config.js in share.js:', err);
  }
  return '';
}

function getLocalAppsData() {
  try {
    const dataPath = path.join(__dirname, '..', 'data.json');
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading data.json:', err);
  }
  return { apps: [] };
}

async function getAppsData() {
  const now = Date.now();
  // Trả về cache bộ nhớ tạm nếu còn mới (< 3 phút)
  if (memoryCache.data && (now - memoryCache.timestamp < 180000)) {
    return memoryCache.data;
  }

  const localData = getLocalAppsData();
  const scriptUrl = getAppsScriptUrl();

  if (!scriptUrl) {
    return localData;
  }

  // Tải trực tiếp dữ liệu mới nhất từ Google Apps Script
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s timeout để người dùng không phải chờ lâu
    const res = await fetch(`${scriptUrl}?action=getAll`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        memoryCache.data = json.data;
        memoryCache.timestamp = now;
        return json.data;
      }
    }
  } catch (e) {
    // Nếu mạng chậm hoặc timeout thì tiếp tục dùng dữ liệu cục bộ
  }

  if (memoryCache.data) return memoryCache.data;
  return localData;
}

module.exports = async (req, res) => {
  const rawAppId = String(req.query.app || req.query.id || '').trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'aigiaoduc.io.vn';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const data = await getAppsData();
  let app = (data.apps || []).find(a => String(a.id).trim().toLowerCase() === rawAppId.toLowerCase());

  // Nếu vẫn chưa tìm thấy, đối chiếu thêm với file data.json cục bộ
  if (!app) {
    const localData = getLocalAppsData();
    app = (localData.apps || []).find(a => String(a.id).trim().toLowerCase() === rawAppId.toLowerCase());
  }

  // ĐẢM BẢO TUYỆT ĐỐI: Dù là app cũ hay app mới bổ sung trên Sheet (như UD22), link đích luôn chứa mã app
  const targetAppId = (app && app.id) ? app.id : rawAppId;
  const targetAppUrl = targetAppId ? `${baseUrl}/?app=${encodeURIComponent(targetAppId)}` : baseUrl;
  const canonicalUrl = `${baseUrl}/share?app=${encodeURIComponent(targetAppId || rawAppId)}`;

  const appName = app ? app.name : (targetAppId ? `Công Cụ Sư Phạm ${targetAppId}` : 'AI Giáo Dục - Trợ Lý Sư Phạm & Lớp Học Thông Minh');
  const appDesc = app 
    ? (app.desc || app.short_desc || 'Công cụ AI hỗ trợ giảng dạy và công việc giáo viên')
    : 'Hệ thống trợ lý AI và công cụ chuyển đổi số sư phạm dành cho giáo viên và học sinh.';
  
  // Link ảnh của ứng dụng (lấy từ cột ảnh của Sheet)
  let appImg = (app && app.img) ? app.img.trim() : `${baseUrl}/og-image.jpg`;
  if (appImg.startsWith('/')) {
    appImg = `${baseUrl}${appImg}`;
  }

  const safeTitle = appName.replace(/"/g, '&quot;');
  const safeDesc = appDesc.replace(/"/g, '&quot;');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - AI Giáo Dục</title>

  <!-- Google AdSense Verification & Script -->
  <meta name="google-adsense-account" content="ca-pub-1754036911359335">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1754036911359335"
       crossorigin="anonymous"></script>

  <!-- Open Graph / Facebook / Zalo / Messenger -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${safeTitle} | AI Giáo Dục">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${appImg}">
  <meta property="og:image:secure_url" content="${appImg}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${safeTitle}">
  <meta property="og:site_name" content="AI Giáo Dục - Thầy Trần Hồng Quân">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${safeTitle} | AI Giáo Dục">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${appImg}">

  <!-- Tự động chuyển hướng ngay người dùng vào đúng ứng dụng -->
  <meta http-equiv="refresh" content="0;url=${targetAppUrl}">
  <script>
    window.location.replace("${targetAppUrl}");
  </script>

  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      color: #1e293b;
      padding: 16px;
    }
    .card {
      max-width: 440px;
      width: 100%;
      background: #ffffff;
      padding: 28px 24px;
      border-radius: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .thumb {
      width: 110px;
      height: 110px;
      object-fit: cover;
      border-radius: 20px;
      margin: 0 auto 16px;
      border: 2px solid #14b8a6;
      box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
    }
    h1 {
      font-size: 18px;
      font-weight: 800;
      margin: 0 0 8px;
      color: #0f172a;
    }
    p {
      font-size: 13px;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 20px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      background: #0d9488;
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border-radius: 14px;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #0f766e;
    }
  </style>
</head>
<body>
  <div class="card">
    <img src="${appImg}" alt="${safeTitle}" class="thumb" onerror="this.src='${baseUrl}/logo.jpg'" />
    <h1>${safeTitle}</h1>
    <p>${safeDesc}</p>
    <a href="${targetAppUrl}" class="btn">Đang mở ứng dụng... Bấm vào đây nếu chưa tải</a>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300');
  return res.status(200).send(html);
};
