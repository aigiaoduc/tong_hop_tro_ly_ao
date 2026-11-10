const fs = require('fs');
const path = require('path');

// Bộ nhớ cache tạm thời trong môi trường serverless (15 phút)
let memoryCache = {
  apps: null,
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

function getLocalApps() {
  try {
    const dataPath = path.join(__dirname, '..', 'data.json');
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf8');
      const parsed = JSON.parse(content);
      return Array.isArray(parsed.apps) ? parsed.apps : [];
    }
  } catch (err) {
    console.error('Error reading data.json:', err);
  }
  return [];
}

function findAppById(appList, id) {
  if (!id || !Array.isArray(appList)) return null;
  const target = String(id).trim().toLowerCase();
  return appList.find(a => a && a.id && String(a.id).trim().toLowerCase() === target) || null;
}

// Lấy thông tin ứng dụng: memoryCache -> data.json -> Google Apps Script
async function resolveApp(rawAppId) {
  if (!rawAppId) return null;

  // 1. Kiểm tra trong bộ nhớ đệm memoryCache
  if (memoryCache.apps && memoryCache.apps.length > 0) {
    const cached = findAppById(memoryCache.apps, rawAppId);
    if (cached) return cached;
  }

  // 2. Kiểm tra trong file data.json cục bộ (phản hồi tức thì < 1ms)
  const localList = getLocalApps();
  const localApp = findAppById(localList, rawAppId);
  if (localApp) {
    if (!memoryCache.apps) memoryCache.apps = localList;
    return localApp;
  }

  // 3. Nếu là app mới vừa thêm trên Google Sheet (chưa có trong data.json)
  const scriptUrl = getAppsScriptUrl();
  if (!scriptUrl) return null;

  // Cách 3a: Tra cứu nhanh 1 ứng dụng duy nhất (tiết kiệm thời gian)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(`${scriptUrl}?action=getApp&app=${encodeURIComponent(rawAppId)}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data && json.data.id) {
        if (!memoryCache.apps) memoryCache.apps = localList.slice();
        memoryCache.apps.push(json.data);
        return json.data;
      }
    }
  } catch (e) {
    // getApp không phản hồi hoặc phiên bản cũ chưa có action này
  }

  // Cách 3b: Tải toàn bộ danh sách mới nhất từ Apps Script (timeout 11s)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 11000);
    const res = await fetch(`${scriptUrl}?action=getAll`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data && Array.isArray(json.data.apps)) {
        memoryCache.apps = json.data.apps;
        memoryCache.timestamp = Date.now();
        return findAppById(json.data.apps, rawAppId);
      }
    }
  } catch (e) {
    console.error('Fetch live Apps Script timeout/error:', e.message);
  }

  return null;
}

function sanitizeText(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\r\n]+/g, ' ')
    .replace(/[*_#`~[\]]/g, '')
    .replace(/"/g, '&quot;')
    .trim();
}

module.exports = async (req, res) => {
  const rawAppId = String(req.query.app || req.query.id || '').trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'aigiaoduc.io.vn';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const app = await resolveApp(rawAppId);

  const targetAppId = (app && app.id) ? app.id : rawAppId;
  const targetAppUrl = targetAppId ? `${baseUrl}/?app=${encodeURIComponent(targetAppId)}` : baseUrl;
  const canonicalUrl = `${baseUrl}/share?app=${encodeURIComponent(targetAppId || rawAppId)}`;

  const appName = app ? app.name : 'AI Giáo Dục - Trợ Lý Sư Phạm & Lớp Học Thông Minh';
  const rawDesc = app 
    ? (app.short_desc || app.desc || 'Hệ thống trợ lý AI và công cụ chuyển đổi số sư phạm dành cho giáo viên và học sinh.')
    : 'Hệ thống trợ lý AI và công cụ chuyển đổi số sư phạm dành cho giáo viên và học sinh.';
  
  let appImg = (app && app.img && app.img.trim()) ? app.img.trim() : `${baseUrl}/og-image.jpg`;
  if (appImg.startsWith('/')) {
    appImg = `${baseUrl}${appImg}`;
  }

  const safeTitle = sanitizeText(appName);
  const safeDesc = sanitizeText(rawDesc);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - AI Giáo Dục</title>

  <!-- Google AdSense Verification & Auto Ads -->
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

  <!-- Link ảnh hỗ trợ Zalo Crawler và ứng dụng nhắn tin -->
  <link rel="image_src" href="${appImg}">

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
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
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
