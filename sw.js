// Service worker: guarda la app en el teléfono para que funcione sin internet.
// IMPORTANTE: cada vez que cambies la app, sube el número de versión (v1 → v2)
// para que los celulares de tus clientes descarguen la versión nueva.
const VERSION = "eem-timer-v5";
const ARCHIVOS = ["./", "index.html", "logo.png", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Primero intenta internet (para recibir actualizaciones); si no hay, usa lo guardado.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copia = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
