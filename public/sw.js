// Cache version and app shell (bumped version)
const CACHE_NAME = "hr-cache-v3";
const APP_SHELL = [
  "/", // navigation shell
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/gomind.png",
];

// Install: cache app shell and activate new SW immediately
self.addEventListener("install", (event) => {
  // Skip waiting to activate the new SW right away
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(APP_SHELL);
    })
  );
});

// Activate: remove old caches and take control of clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Claim clients so the new SW controls pages without reload
      self.clients.claim(),
      // Delete any caches that don't match the current version
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

// Fetch: handle requests with proper cache strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip service worker requests
  if (request.url.includes("/sw.js")) {
    return;
  }

  // 1) For navigation requests (HTML pages), serve from cache first, then network
  if (request.mode === "navigate") {
    event.respondWith(
      caches
        .match("/")
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version but also update cache in background
            fetch(request).then((response) => {
              if (response.ok) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put("/", response.clone());
                });
              }
            });
            return cachedResponse;
          }
          return fetch(request);
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // 2) For hashed assets (JS, CSS files), always go to network first
  if (
    url.pathname.includes("/assets/") &&
    (url.pathname.includes(".js") || url.pathname.includes(".css"))
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache as fallback
          return caches.match(request);
        })
    );
    return;
  }

  // 3) For API requests, always go to network (no caching)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  // 4) For other static assets, try cache first, then network
  event.respondWith(
    caches
      .match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request);
      })
      .catch(() => fetch(request))
  );
});
