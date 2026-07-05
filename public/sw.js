const CACHE_NAME = 'vaayu-ai-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install Event: cache initial shell assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching App Shell Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate caching strategy
self.addEventListener('fetch', event => {
  // Bypassing non-GET requests (e.g. tracking or post endpoints) and API requests
  if (event.request.method !== 'GET' || event.request.url.includes('api.openaq.org')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached asset immediately if found, but fetch fresh copy in the background
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, cacheCopy);
          });
        }
        return networkResponse;
      }).catch(err => {
        console.log('Fetch failed, serving from cache if available:', err);
      });

      return cachedResponse || fetchPromise;
    })
  );
});
