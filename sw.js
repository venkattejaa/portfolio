// Service Worker for Venkat Teja Portfolio
const CACHE_NAME = 'venkat-teja-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/icons/ai-icon.svg',
    '/icons/web-icon.svg',
    '/icons/android-icon.svg',
    '/icons/llm-icon.svg',
    '/icons/api-icon.svg',
    '/icons/mvp-icon.svg',
    '/icons/opensource-icon.svg',
    '/icons/proof-icon.svg',
    '/icons/guarantee-icon.svg',
    '/icons/chat-icon.svg',
    '/icons/process-icon.svg',
    '/icons/identity-icon.svg',
    '/icons/code-icon.svg',
    '/icons/agent-icon.svg',
    '/dark_logo_without_name.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.log('Cache failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Return offline page for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
        event.waitUntil(sendContactForm());
    }
});

// Push notifications (optional)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/icons/ai-icon.svg',
        badge: '/icons/ai-icon.svg',
        vibrate: [100, 50, 100],
        data: {
            url: event.data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Venkat Teja', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
