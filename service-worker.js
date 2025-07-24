// service-worker.js

const CACHE_NAME = 'chinese-guide-v1';
// UPDATED paths to include the repository name
const urlsToCache = [
  '/china-guide/', // Important: Cache the base URL including the repo name
  '/china-guide/index.html',
  '/china-guide/manifest.json',
  '/china-guide/service-worker.js', // Cache itself
  // You would also include your icon files here:
  // '/china-guide/icons/icon-192x192.png',
  // '/china-guide/icons/icon-512x512.png',
  // Hand sign images for numbers
  '/china-guide/img/6.png',
  '/china-guide/img/7.png',
  '/china-guide/img/8.png',
  '/china-guide/img/9.png',
  // External resources (like Tailwind CSS CDN) typically shouldn't be aggressively cached by *your* service worker
  // unless you have control over them and specific reasons to do so.
  // For basic offline, only cache your primary assets.
];

// Install event: caches essential app shell files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache during install:', error);
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Fetch event: serves cached content or fetches from network
self.addEventListener('fetch', (event) => {
  // We want to respond to all requests with a cached asset, if available,
  // falling back to the network if not.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }
        // No cache hit - fetch from network
        console.log('Fetching from network:', event.request.url);
        return fetch(event.request);
      })
      .catch((error) => {
        console.error('Fetch failed for:', event.request.url, error);
        // You can return an offline page here if desired for network failures
        // return caches.match('/offline.html');
      })
  );
});

// Register the Service Worker in your index.html
// This part is handled by the script tag at the bottom of index.html
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     // UPDATED scope for registration
//     navigator.serviceWorker.register('/china-guide/service-worker.js')
//       .then(registration => {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       })
//       .catch(err => {
//         console.error('ServiceWorker registration failed: ', err);
//       });
//   });
// }
