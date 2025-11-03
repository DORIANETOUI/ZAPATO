const CACHE_NAME = 'zapato-v3';
const urlsToCache = [
    '/ZAPATO/',
    '/ZAPATO/index.html',
    '/ZAPATO/style.css',
    '/ZAPATO/script.js',
    '/ZAPATO/products.json',
    '/ZAPATO/manifest.json',
    '/ZAPATO/icons/icon-192x192.png',
    '/ZAPATO/icons/icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // ✅ Fallback offline
            if (event.request.destination === 'document') {
                return caches.match('/ZAPATO/index.html');
            }
        })
    );
});
