// Mudei o nome aqui para "v2" para forçar a atualização
const CACHE_NAME = "liferpg-bruno-v2"; 

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./icon.png",
  "./manifest.json"
];

// Instalação
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Força a atualização imediata
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação (Limpa caches antigos)
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Requisição
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
