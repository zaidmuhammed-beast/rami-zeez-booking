/*
 * Rami ZeeZ service worker.
 *
 * Deliberately conservative: seat counts and admin data must never be served
 * stale, so only the app shell and static assets are cached. Pages are
 * fetched from the network first and fall back to a cached copy, then to the
 * offline page, when the connection drops.
 */

const VERSION = "v1";
const STATIC_CACHE = `rz-static-${VERSION}`;
const PAGE_CACHE = `rz-pages-${VERSION}`;
const OFFLINE_URL = "/offline";

const PRECACHE = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Anything whose freshness matters, or that isn't ours, bypasses the cache. */
function shouldBypass(url, request) {
  if (request.method !== "GET") return true;
  if (url.origin !== self.location.origin) return true;
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname.startsWith("/admin")) return true;
  if (url.pathname.startsWith("/confirmation/")) return true;
  return false;
}

/** Hashed build output and images never change under the same URL. */
function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/fonts/")
  );
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (shouldBypass(url, event.request)) return;

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request).then(
        (hit) =>
          hit ||
          fetch(event.request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || caches.match(OFFLINE_URL);
        })
    );
  }
});
