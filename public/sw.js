// Simple service worker for PWA
const CACHE_NAME = 'rmxr-v1';

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handler - no caching for MVP
  event.respondWith(fetch(event.request));
});
