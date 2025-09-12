// Service Worker for Dutch Learning Tools PWA
const CACHE_NAME = 'dutch-learning-tools-v1';
const STATIC_CACHE_NAME = 'dutch-learning-static-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/logo.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/site.webmanifest'
];

// Data files to cache for offline use
const DATA_ASSETS = [
  '/src/data/dutch-nouns.json',
  '/src/data/dutch-verbs.json',
  '/src/data/dutch-adjectives.json',
  '/src/data/dutch-adverbs.json',
  '/src/data/dutch-comparatives.json',
  '/src/data/dutch-conjunctions.json',
  '/src/data/dutch-negation.json',
  '/src/data/dutch-object-pronouns.json',
  '/src/data/dutch-prepositions.json',
  '/src/data/dutch-pronominal-adverbs.json',
  '/src/data/dutch-reflexive-verbs.json',
  '/src/data/dutch-separable-verbs.json',
  '/src/data/rules-articles.json',
  '/src/data/verbs-with-fixed-preposition.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache data files
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching data files');
        return cache.addAll(DATA_ASSETS);
      })
    ]).then(() => {
      console.log('Service Worker: Install complete');
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (Google Analytics, etc.)
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    // Try cache first, then network
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('Service Worker: Serving from cache:', request.url);
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(request).then((networkResponse) => {
        // Don't cache if response is not ok
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response (can only be consumed once)
        const responseToCache = networkResponse.clone();

        // Determine which cache to use
        const cacheName = isStaticAsset(request.url) ? STATIC_CACHE_NAME : CACHE_NAME;

        // Add to cache for future use
        caches.open(cacheName).then((cache) => {
          console.log('Service Worker: Caching new resource:', request.url);
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Network failed, try to serve offline fallback
        console.log('Service Worker: Network failed for:', request.url);
        
        // For navigation requests, serve offline page
        if (request.destination === 'document') {
          return caches.match('/offline.html') || caches.match('/');
        }
        
        // For other resources, return cached version or nothing
        return caches.match(request);
      });
    })
  );
});

// Helper function to determine if a URL is a static asset
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('/assets/') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.ico') ||
         url.includes('.svg');
}

// Handle background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Here you can implement logic to sync data when connection is restored
      console.log('Service Worker: Performing background sync')
    );
  }
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Dutch Learning Tools', options)
  );
});
