const CACHE_NAME = 'teacher-app-store-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
];

// Cài đặt Service Worker và cache các file tĩnh
self.addEventListener('install', (event) => {
  // Buộc Service Worker kích hoạt ngay lập tức không cần chờ
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log('Lỗi cache:', err))
  );
});

// Kích hoạt Service Worker
self.addEventListener('activate', (event) => {
  // Xóa các cache cũ nếu có update version
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Kiểm soát các clients ngay lập tức
  );
});

// Xử lý request mạng (Offline first hoặc Network first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Trả về cache nếu có, không thì fetch từ mạng
        return response || fetch(event.request);
      })
  );
});