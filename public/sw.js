// Minimal Service Worker for PWA Installation Only
// No caching - just enables app installation

const CACHE_NAME = "hr-pwa-v1";

// Install: minimal setup for PWA
self.addEventListener("install", (event) => {
  console.log("[SW] Installing minimal service worker");
  self.skipWaiting();
});

// Activate: clean up any old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating minimal service worker");

  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up any old caches
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log("[SW] Deleting old cache:", key);
              return caches.delete(key);
            })
        )
      ),
    ])
  );
});

// Fetch: pass through all requests (no caching)
self.addEventListener("fetch", (event) => {
  // Let all requests go to network - no caching
  event.respondWith(fetch(event.request));
});
