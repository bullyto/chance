/* sw.js */
const SW_VERSION = "2025-12-23-01"; // <<< change ça à chaque modif

importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Juste pour "marquer" la version dans le cache SW (oblige Chrome à voir un diff)
self.__SW_VERSION__ = SW_VERSION;

// Force activation rapide
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Permet au site de demander "skipWaiting" (optionnel mais utile)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
