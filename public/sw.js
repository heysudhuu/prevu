// Prevu Progressive Web App Service Worker
const CACHE_NAME = 'prevu-static-v1';
const PDF_VAULT_CACHE = 'prevu-pdf-vault-v1';

const STATIC_ASSETS = [
  '/',
  '/vault',
  '/manifest.json',
  '/icon-512.svg'
];

// 1. Install event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Prevu SW] Pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate event: Cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== PDF_VAULT_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch event: Smart routing & offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension / analytics requests
  if (request.method !== 'GET') return;
  if (url.protocol.startsWith('chrome-extension')) return;
  if (url.pathname.startsWith('/api/analytics')) return;

  // A. PDF Vault Requests (Previews & Downloads)
  if (url.pathname.startsWith('/api/preview/') || url.pathname.startsWith('/api/download/')) {
    event.respondWith(
      caches.open(PDF_VAULT_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          // Serve from offline vault cache
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          if (cachedResponse) return cachedResponse;
          throw err;
        }
      })
    );
    return;
  }

  // B. Static & App Routes: Stale-while-revalidate for faster loading
  if (url.origin === self.location.origin) {
    // For page navigations: Network-first with cache fallback
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request).catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const vaultPage = await caches.match('/vault');
          if (vaultPage) return vaultPage;
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              <title>Prevu — Offline Mode</title>
              <style>
                body { background: #09090d; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
                h1 { font-size: 24px; color: #a855f7; margin-bottom: 8px; }
                p { color: #a1a1aa; font-size: 14px; max-width: 400px; line-height: 1.5; }
                a { display: inline-block; margin-top: 16px; padding: 10px 20px; background: #7928ca; color: #fff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; }
              </style>
            </head>
            <body>
              <h1>📡 You are Offline</h1>
              <p>No internet connection detected. You can still access all question papers saved to your device in your Offline Vault!</p>
              <a href="/vault">Open Offline Vault</a>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
      );
      return;
    }

    // Static assets
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
