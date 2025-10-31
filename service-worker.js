const CACHE_NAME = 'zapato-v2'; // Changé de v1 à v2 pour forcer la mise à jour
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/products.json',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    console.log('[Service Worker] Installation en cours...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Mise en cache des ressources');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[Service Worker] Installation terminée');
                return self.skipWaiting(); // Active immédiatement le nouveau SW
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activation en cours...');
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Activation terminée');
            return self.clients.claim(); // Prend le contrôle immédiatement
        })
    );
});

// Interception des requêtes (Stratégie Network-First pour les contenus dynamiques)
self.addEventListener('fetch', event => {
    // Pour les images Unsplash, toujours essayer le réseau d'abord
    if (event.request.url.includes('images.unsplash.com')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Si le réseau échoue, retourner une image placeholder
                    return caches.match('/icons/icon-512x512.png');
                })
        );
        return;
    }

    // Pour le reste, stratégie Cache-First
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('[Service Worker] Ressource servie depuis le cache:', event.request.url);
                    return response;
                }
                
                console.log('[Service Worker] Récupération depuis le réseau:', event.request.url);
                return fetch(event.request).then(fetchResponse => {
                    // Mettre en cache les nouvelles ressources
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
            .catch(error => {
                console.error('[Service Worker] Erreur de récupération:', error);
            })
    );
});