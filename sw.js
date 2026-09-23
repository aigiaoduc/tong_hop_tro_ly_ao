/**
 * Service Worker cho AI Giáo Dục (PWA)
 * Hỗ trợ offline và cài đặt ứng dụng trên điện thoại/máy tính
 */

const CACHE_NAME = 'aigiaoduc-pwa-v3.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/config.js',
  '/data.js',
  '/app.js',
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

  // Bỏ qua các request POST hoặc request gọi Google Apps Script (để tránh lỗi CORS trong SW)
  if (event.request.method !== 'GET' || url.origin.includes('script.google.com') || url.origin.includes('googleusercontent.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Trả về cache nếu có, đồng thời fetch nền cập nhật
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
