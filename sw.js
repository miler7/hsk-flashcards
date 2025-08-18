const CACHE_NAME = 'flashcards-preloaded-v1';
const OFFLINE_URLS = ['./','./index.html','./manifest.webmanifest','./sw.js','./icon-512.png'];
self.addEventListener('install', e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(OFFLINE_URLS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const net = await fetch(event.request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, net.clone());
      return net;
    } catch (e) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') return cache.match('./index.html');
      return Response.error();
    }
  })());
});