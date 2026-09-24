const CACHE_NAME = 'race-timer-v2';
const APP_BASE_URL = new URL('./', self.location.href);
const FILES_TO_CACHE = ['./', './index.html', './manifest.json'].map(path => new URL(path, APP_BASE_URL).href);

// 1. Install the Service Worker and cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching files.');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.filter(name => name.startsWith('race-timer-') && name !== CACHE_NAME)
        .map(name => caches.delete(name))
    ))
  );
  self.clients.claim();
});

// 2. Serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME })
      .then((response) => {
        // If we have a match in the cache, return it.
        // Otherwise, fetch it from the network.
        return response || fetch(event.request);
      })
  );
});
