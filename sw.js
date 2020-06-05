class Pwa {

    constructor(self) {
        this.scope = self;
        this.CACHE_VERSION = 3.0;
        // dir /s /b /a:-D
        this.BASE_CACHE_FILES = ["index.html", "manifest.json", "readme.md", "sw.js", "assets/css/custom.css", "assets/css/dark.css", "assets/css/main.css", "assets/css/milligram.min.css", "assets/css/normalize.css", "assets/css/style.css", "assets/css/fa/css/all.min.css", "assets/css/fa/webfonts/fa-brands-400.eot", "assets/css/fa/webfonts/fa-brands-400.svg", "assets/css/fa/webfonts/fa-brands-400.ttf", "assets/css/fa/webfonts/fa-brands-400.woff", "assets/css/fa/webfonts/fa-brands-400.woff2", "assets/css/fa/webfonts/fa-regular-400.eot", "assets/css/fa/webfonts/fa-regular-400.svg", "assets/css/fa/webfonts/fa-regular-400.ttf", "assets/css/fa/webfonts/fa-regular-400.woff", "assets/css/fa/webfonts/fa-regular-400.woff2", "assets/css/fa/webfonts/fa-solid-900.eot", "assets/css/fa/webfonts/fa-solid-900.svg", "assets/css/fa/webfonts/fa-solid-900.ttf", "assets/css/fa/webfonts/fa-solid-900.woff", "assets/css/fa/webfonts/fa-solid-900.woff2", "assets/images/apple-touch-icon-144x144.png", "assets/images/apple-touch-icon-152x152.png", "assets/images/favicon-128.png", "assets/images/favicon-196x196.png", "assets/images/logo.svg", "assets/images/splash.png", "assets/js/extend.js", "assets/js/script.js", "assets/js/p5.min.js", "assets/js/sketch.js", "fonts/font (0).ttf", "fonts/font (1).ttf", "fonts/font (2).ttf", "fonts/font (3).ttf", "fonts/font (4).ttf", "fonts/font (5).ttf", "fonts/font (6).ttf", "fonts/font (7).ttf", "fonts/font (8).ttf", "fonts/font (9).ttf", "pages/page (2).jpg"]
        
        this.host = `${self.location.protocol}//${self.location.host}`;
        console.info(`Host: ${this.host}`);
        this.OFFLINE_PAGE = '/offline/';
        this.NOT_FOUND_PAGE = '/404.html';
        this.CACHE_NAME = `content-v${this.CACHE_VERSION}`;
        this.MAX_TTL = 86400;
        this.TTL_EXCEPTIONS = ["jpg", "jpeg", "png", "gif", "mp4"];
    }

    canCache(url) {
        if (url.startsWith("http://localhost")) {
            return false;
        }
        const result = url.toString().startsWith(this.host);
        return result;
    }

    getFileExtension(url) {
        const extension = url.split('.').reverse()[0].split('?')[0];
        return (extension.endsWith('/')) ? '/' : extension;
    }

    getTTL(url) {
        if (typeof url === 'string') {
            const extension = this.getFileExtension(url);
            return ~this.TTL_EXCEPTIONS.indexOf(extension) ?
                null : this.MAX_TTL;
        }
        return null;
    }

    async installServiceWorker() {
        try {
            await caches.open(this.CACHE_NAME).then((cache) => {
                return cache.addAll(this.BASE_CACHE_FILES);
            }, err => console.error(`Error with ${this.CACHE_NAME}`, err));
            return this.scope.skipWaiting();
        }
        catch (err) {
            return console.error("Error with installation: ", err);
        }
    }

    cleanupLegacyCache() {

        const currentCaches = [this.CACHE_NAME];

        return new Promise(
            (resolve, reject) => {
                caches.keys()
                    .then((keys) => keys.filter((key) => !~currentCaches.indexOf(key)))
                    .then((legacy) => {
                        if (legacy.length) {
                            Promise.all(legacy.map((legacyKey) => caches.delete(legacyKey))
                            ).then(() => resolve()).catch((err) => {
                                console.error("Error in legacy cleanup: ", err);
                                reject(err);
                            });
                        } else {
                            resolve();
                        }
                    }).catch((err) => {
                        console.error("Error in legacy cleanup: ", err);
                        reject(err);
                    });
            });
    }

    async preCacheUrl(url) {
        const cache = await caches.open(this.CACHE_NAME);
        const response = await cache.match(url);
        if (!response) {
            return fetch(url).then(resp => cache.put(url, resp.clone()));
        }
        return null;
    }

    register() {
        this.scope.addEventListener('install', event => {
            event.waitUntil(
                Promise.all([
                    this.installServiceWorker(),
                    this.scope.skipWaiting(),
                ]));
        });

        this.scope.addEventListener('activate', event => {
            event.waitUntil(Promise.all(
                [this.cleanupLegacyCache(),
                this.scope.clients.claim(),
                this.scope.skipWaiting()]).catch((err) => {
                    console.error("Activation error: ", err);
                    event.skipWaiting();
                }));
        });

        this.scope.addEventListener('fetch', event => {
            event.respondWith(
                caches.open(this.CACHE_NAME).then(async cache => {
                    if (!this.canCache(event.request.url)) {
                        return fetch(event.request);
                    }
                    const response = await cache.match(event.request);
                    if (response) {
                        const headers = response.headers.entries();
                        let date = null;
                        for (let pair of headers) {
                            if (pair[0] === 'date') {
                                date = new Date(pair[1]);
                                break;
                            }
                        }
                        if (!date) {
                            return response;
                        }
                        const age = parseInt(((new Date().getTime() - date.getTime()) / 1000).toString());
                        const ttl = this.getTTL(event.request.url);
                        if (ttl === null || (ttl && age < ttl)) {
                            return response;
                        }
                    }
                    return fetch(event.request.clone()).then(resp => {
                        if (resp.status < 400) {
                            if (this.canCache(event.request.url)) {
                                cache.put(event.request, resp.clone());
                            }
                            return resp;
                        }
                        else {
                            return cache.match(this.NOT_FOUND_PAGE);
                        }
                    }).catch(err => {
                        console.error(`Error fetching ${event.request.url} resulted in offline`, err);
                        return cache.match(this.OFFLINE_PAGE);
                    })
                }));
        });
    }
}

const pwa = new Pwa(self);
pwa.register();