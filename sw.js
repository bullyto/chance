/* sw.js — OneSignal + mise à jour propre (sans boucle) */

/**
 * Change cette valeur quand tu veux forcer une nouvelle version
 * (ça garantit une différence de fichier => Chrome voit une MAJ)
 */
const SW_VERSION = "2025-12-23-01";

/**
 * OneSignal SW
 * (obligatoire pour push)
 */
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

/**
 * Install:
 * - on laisse le SW s’installer normalement
 * - PAS de skipWaiting automatique ici pour éviter les reload loops
 */
self.addEventListener("install", (event) => {
  // optionnel: tu peux préchauffer un micro cache si tu veux, mais pas nécessaire
});

/**
 * Activate:
 * - prend le contrôle des pages ouvertes
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/**
 * Permet à la page (index.html) de demander l’activation immédiate
 * sans attendre que tous les onglets se ferment.
 */
self.addEventListener("message", (event) => {
  if (!event || !event.data) return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * Petit “marqueur” de version (debug)
 * (ne change rien au fonctionnement, mais aide à vérifier que le fichier bouge)
 */
self.__SW_VERSION__ = SW_VERSION;
