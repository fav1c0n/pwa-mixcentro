const filesToCache = [
  './index.html',
  './assets/css/style.css',
  './js/index.js',
  './assets/audio/bubbles.mp3',
  './assets/audio/clay.mp3',
  './assets/audio/confetti.mp3',
  './assets/audio/glimmer.mp3',
  './assets/audio/moon.mp3',
  './assets/audio/ufo.mp3'
];

const staticCacheName = 'pages-cache-v1';


self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(response => {
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      }).catch(error => {
        return caches.match('index.html');
      })
  );
});
