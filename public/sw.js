// Cache version and app shell
const CACHE_NAME = "hr-cache-v1";
const APP_SHELL = [
  "/",             // navigation shell
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/gomind.png",
];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(APP_SHELL);
    })
  );
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

// Fetch: differentiate navigation vs. static asset
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 1) If this is a navigation request (HTML shell):
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("/")            // serve cached shell
        .then((resp) => resp || fetch(request))
        .catch(() => caches.match("/"))
    );
    return;
  }

  // 2) Otherwise—static asset or API—just pass through
  event.respondWith(fetch(request));
});
