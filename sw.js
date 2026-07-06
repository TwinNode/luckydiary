/* 일운 기록 service worker — offline shell cache */
const CACHE = 'iljin-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const accept = req.headers.get('accept') || '';
  const isHTML = req.mode === 'navigate' || accept.includes('text/html');

  if (isHTML) {
    // network-first for the page so updates show immediately when online
    e.respondWith(
      fetch(req)
        .then((resp) => { const c = resp.clone(); caches.open(CACHE).then((ca) => ca.put(req, c)); return resp; })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // cache-first for static assets (icons, cdn lib)
  e.respondWith(
    caches.match(req).then((r) => r || fetch(req).then((resp) => {
      try {
        const url = new URL(req.url);
        if (url.origin === location.origin || url.href.includes('xlsx.full.min.js')) {
          const c = resp.clone(); caches.open(CACHE).then((ca) => ca.put(req, c));
        }
      } catch (_) {}
      return resp;
    }).catch(() => undefined))
  );
});
