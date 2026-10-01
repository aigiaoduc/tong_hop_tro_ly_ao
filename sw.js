/**
 * Service Worker cho AI Giáo Dục (PWA)
 * Hỗ trợ offline và cài đặt ứng dụng trên điện thoại/máy tính
 */

const CACHE_NAME = 'aigiaoduc-pwa-v4.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((e) => console.log('SW cache err:', e));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bỏ qua các request POST, request Google Apps Script, hoặc request API để luôn lấy dữ liệu tươi mới
  if (
    event.request.method !== 'GET' ||
    url.origin.includes('script.google.com') ||
    url.origin.includes('googleusercontent.com') ||
    url.pathname.startsWith('/api/') ||
    url.searchParams.has('_t') ||
    url.searchParams.has('refresh')
  ) {
    return;
  }

  // Đối với config.js, data.js, app.js: Network First (ưu tiên mạng để lấy cập nhật mới nhất)
  if (url.pathname.endsWith('config.js') || url.pathname.endsWith('data.js') || url.pathname.endsWith('app.js')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Các tài nguyên tĩnh khác: Cache First với fallback Network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
