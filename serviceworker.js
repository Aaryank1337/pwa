// Define the cache name and files to cache
const staticCacheName = "pwa-cache-v1";
const filesToCache = [
  '/',
  '/index.html',
  '/offline.html'
];

// Install Event: Pre-cache the files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== staticCacheName) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch Event: Serve cached content, fallback to offline page
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match('/offline.html'))
      );
    })
  );
});
