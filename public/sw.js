// Service Worker for GIX CHATS - Web Push & Offline Support
const CACHE_NAME = 'gix-chat-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/notification.wav',
  '/notification.mp3'
];

// Install: precache assets and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache partial error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network first with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip API or chrome-extension URLs
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// ==========================================
// WEB PUSH NOTIFICATION HANDLERS
// ==========================================

self.addEventListener('push', (event) => {
  let data = {
    title: '🤖 GIX CHATS',
    body: 'Karibu GIX CHATS! Fungua account yako na uanze kufanya AI Jobs kwa Kiswahili. 💰',
    url: '/?tab=account',
    tag: 'gix-chat-push',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/pwa-192x192.png',
    badge: data.badge || '/pwa-192x192.png',
    image: data.image || undefined,
    tag: data.tag || 'gix-chat-notification',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 300],
    sound: '/notification.mp3',
    silent: false,
    timestamp: Date.now(),
    data: {
      url: data.url || '/?tab=account',
      target: data.target || 'account',
      receivedAt: Date.now(),
    },
    actions: [
      {
        action: 'open_account',
        title: '👉 Fungua Account (15,000 TSh)',
      },
      {
        action: 'dismiss',
        title: 'Baadaye',
      }
    ]
  };

  // Broadcast to open browser windows so in-app sound/banner can trigger
  const notifyClients = self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
    windowClients.forEach((client) => {
      client.postMessage({
        type: 'PUSH_RECEIVED',
        payload: data,
      });
    });
  });

  const showNotification = self.registration.showNotification(data.title, options);

  event.waitUntil(Promise.all([showNotification, notifyClients]));
});

// Notification Click Handler: open or focus tab and route to registration/account
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const notificationData = event.notification.data || {};
  let targetUrl = notificationData.url || '/?tab=account';

  // Ensure absolute URL if relative
  const urlToOpen = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open on this origin, focus it and navigate
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(urlToOpen);
          client.focus();
          // Also postMessage to notify active tab
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            url: urlToOpen,
            target: notificationData.target || 'account',
          });
          return;
        }
      }

      // If no window is open, open a new window with the destination URL
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('notificationclose', () => {
  // Analytics or telemetry hook if ever needed
});
