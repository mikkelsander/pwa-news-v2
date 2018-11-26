workbox.core.setCacheNameDetails({
    prefix: 'pwa-news',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime-cache'
});

workbox.setConfig({
    debug: false
});

workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);


//cache available publishers

workbox.routing.registerRoute(
    new RegExp('https://newsapi.org/v2/sources?(.*)'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'publishers',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 5,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);


//cache publisher icons

workbox.routing.registerRoute(
    /https:\/\/icon-locator\.herokuapp\.com\/icon\?url=(.*)/,
    workbox.strategies.cacheFirst({
        cacheName: 'publisher-icons',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 140,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);


//cache headlines

workbox.routing.registerRoute(
    new RegExp('https://newsapi.org/v2/top-headlines?(.*)'),
    workbox.strategies.networkFirst({
        cacheName: 'articles',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 200,
                maxAgeSeconds: 2 * 24 * 60 * 60, // 2 Days
            }),
        ],
    })
);

//cache headline images

workbox.routing.registerRoute(
    /.+\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.networkFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 200,
                maxAgeSeconds: 2 * 24 * 60 * 60, // 2 Days
            }),
        ],
    })
);