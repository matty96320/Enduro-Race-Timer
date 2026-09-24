const CACHE_NAME = 'race-timer-v2';
const FILES_TO_CACHE = [
  '/', // This caches your main index.html
  'https://cdn.tailwindcss.com', // Caches the tailwind file
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' // Caches the font
  // You would add any other external files here
];

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
