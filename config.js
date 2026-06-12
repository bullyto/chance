/*
  Configuration du jeu.
  Objectif actuel : 3 issues actives seulement.
  Total des poids = 100 : Livraison 35 %, Tampon 40 %, Rejouer 25 %.
*/
window.ADN66_ROUE_CONFIG = {
  orderUrl: 'https://aperos.net/',

  // Lien Play Store : à remplacer plus tard par le lien exact de la fiche application si besoin.
  playStoreUrl: 'https://play.google.com/store/search?q=Ap%C3%A9ro%20de%20Nuit%2066&c=apps',

  // Endpoint Cloudflare à brancher quand le Worker sera prêt.
  // Exemple final : 'https://adn66-fidelite-worker.VOTRE-SOUS-DOMAINE.workers.dev/wheel/claim'
  cloudflareClaimUrl: '',

  lockDays: 90,
  installRequired: true,

  // Permet de débloquer si l'app Android ouvre la page avec ?source=android_app
  allowAndroidAppSource: true,

  rewards: [
    {
      id: 'livraison_1_semaine',
      label: 'Livraison offerte pendant 1 semaine',
      wheelLabel: 'Livraison offerte 1 semaine',
      type: 'reward',
      code: 'LIVRAISON7',
      detail: 'Gain relié à votre carte de fidélité. Livraison offerte pendant 7 jours.',
      image: 'assets/rewards/livraison-offerte-1-semaine.png',
      weight: 35,
      wheelCenterDeg: 0
    },
    {
      id: 'tampon_fidelite',
      label: '1 tampon sur la carte de fidélité',
      wheelLabel: '1 tampon fidélité',
      type: 'reward',
      code: 'TAMPON1',
      detail: 'Gain relié à votre carte de fidélité. Un tampon sera ajouté à votre carte.',
      image: 'assets/rewards/1-tampon-fidelite.png',
      weight: 40,
      wheelCenterDeg: 51.428571
    },
    {
      id: 'retourner_la_roue',
      label: 'Retourner la roue',
      wheelLabel: 'Retourner la roue',
      type: 'spin_again',
      code: 'RELANCE',
      detail: 'Vous avez gagné une relance immédiate. Retentez votre chance.',
      image: 'assets/rewards/retourner-la-roue.png',
      weight: 25,
      wheelCenterDeg: 102.857142
    }
  ]
};
