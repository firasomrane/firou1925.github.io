self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('currency-converter').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/js/main.js',
        // 'https://free.currencyconverterapi.com/api/v5/convert',
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'https://free.currencyconverterapi.com/api/v5/currencies'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(

    caches.match(event.request).then(function (response) {

      return response || fetch(event.request);

    })

  );

});
/* 
var dbPromise = idb.open('test-db', 1, function (upgradeDb) {
  var keyValStore = upgradeDb.createObjectStore('keyval');
  keyValStore.put("world", "hello");
}); */