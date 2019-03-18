// Creates a cache and populates it with copies of accessed
// files to be accessed again offline
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open("restaurantMap").then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'restaurant.html',
        'css/styles.css',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg'
      ]);
    })
  );
});

// Returns the cached files as an object map
this.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName === "restaurantMap";
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


// Checks for a network response and, upon not receiving one,
// accesses the cached files to still serve up the webpage
this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse.status === 404) {
          return null;
        }
        return caches.open("restaurantMap").then(cache => {
          cache.put(event.request.url, networkResponse.clone());
          return networkResponse;
        })
      })
    }).catch(error => {
      console.log(error);
      return;
    })
  );
});
