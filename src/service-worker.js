workbox.core.setCacheNameDetails({
    prefix: 'pwa-news',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime-cache'
});


//set up caching of offline google analytics requests to track user's offline behaviour
workbox.googleAnalytics.initialize({
	parameterOverrides: {
		cd1: 'offline',
	},
});


//set up precaching of app shell and 
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);


//background syncing subscriptions requests
const subscriptionBackgroundSync = new workbox.backgroundSync.Plugin('subscriptions', {
	maxRetentionTime: 1 * 60 // Retry for max of 1 Hours
});


//cache offline subscription post requests
workbox.routing.registerRoute(
	new RegExp('https://pwa-news-api.azurewebsites.net/api/subscriptions(.*)'),
	workbox.strategies.networkOnly({
		plugins: [subscriptionBackgroundSync]
	}),
	'POST'
);


//cache offline subscription delete requests
workbox.routing.registerRoute(
	new RegExp('https://pwa-news-api.azurewebsites.net/api/subscriptions(.*)'),
	workbox.strategies.networkOnly({
		plugins: [subscriptionBackgroundSync]
	}),
	'DELETE'
);


//cache subscription get requests
workbox.routing.registerRoute(
	new RegExp('https://pwa-news-api.azurewebsites.net/api/subscriptions(.*)'),
	workbox.strategies.networkFirst({
		cacheName: 'subscriptions',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 5,
				maxAgeSeconds: 2 * 24 * 60 * 60, // 3 Days
			}),
		],
	})
);


//cache publishers
workbox.routing.registerRoute(
	new RegExp('https://pwa-news-api.azurewebsites.net/api/publishers(.*)'),
	workbox.strategies.cacheFirst({
		cacheName: 'publishers',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 5,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
			}),
		],
	})
);


//cache articles
workbox.routing.registerRoute(
	new RegExp('https://pwa-news-api.azurewebsites.net/api/articles?(.*)'),
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'articles',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 30,
				maxAgeSeconds: 3 * 24 * 60 * 60, // 3 Days
			}),
		],
	})
);


//cache images
workbox.routing.registerRoute(
	/.+\.(?:png|gif|jpg|jpeg|svg)$/,

	async ({
		event
	}) => {
	try {
		return await workbox.strategies.staleWhileRevalidate({
			cacheName: 'images',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 80,
					maxAgeSeconds: 3 * 24 * 60 * 60, // 3 Days
				}),
			],
		}).handle({event});
	}
	catch(error) {
		console.log(error)
		console.log("hej")
		console.log(event.request)
		return caches.match('/fallback-image.png')
	}
}
);


workbox.routing.registerRoute(
	/https:\/\/icon-locator\.herokuapp\.com\/icon\?url=(.*)/,

	async ({
		event
	}) => {
		try {
            return await workbox.strategies.cacheFirst().handle({event});           
		} catch (error) {
            const params = new URL(event.request.url).searchParams;	
            const url = params.get('url');
            const domain = extractRootDomain(url);	
            const letter = domain.substring(0,1).toUpperCase();
			return caches.match(`/img/material-letter-icons/${letter}.svg`);
		}
	}
);


//helper functions

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}


function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}