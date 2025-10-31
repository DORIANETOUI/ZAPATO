const CACHE_NAME = 'zapato-v1'; // Nom du cache (changer ce nom force une mise à jour)
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './products.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    // Ajoutez ici tous les fichiers critiques pour l'affichage hors ligne
];

// Étape 1: Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert: mise en cache des ressources');
                return cache.addAll(urlsToCache);
            })
    );
});

// Étape 2: Interception des requêtes (Stratégie Cache-First)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la ressource est dans le cache, la servir immédiatement
                if (response) {
                    return response;
                }
                // Sinon, essayer de la récupérer sur le réseau
                return fetch(event.request);
            })
    );
});

// Étape 3: Mise à jour (Nettoyage des anciens caches)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});