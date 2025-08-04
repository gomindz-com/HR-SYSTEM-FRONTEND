// Cache version and app shell (bumped version)
const CACHE_NAME = "hr-cache-v2";
const APP_SHELL = [
  "/",             // navigation shell
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
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key !== CACHE_NAME)
              .map((key) => caches.delete(key))
          )
        ),
    ])
  );
});

// Fetch: differentiate between navigation requests and assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 1) Serve cached shell for navigations (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("/")
        .then((resp) => resp || fetch(request))
        .catch(() => caches.match("/"))
    );
    return;
  }

  // 2) For all other requests (assets, API), bypass cache and go to network
  event.respondWith(fetch(request));
});
