/*
  Configuration simple du jeu.
  Pour modifier les chances, changez seulement les valeurs `weight`.
  Plus le chiffre est élevé, plus le lot sort souvent.
*/
window.ADN66_ROUE_CONFIG = {
  googleReviewUrl: 'https://g.page/r/CeR1XkHseNX9EBM/review',
  orderUrl: 'https://aperos.net/',
  lockDays: 90,
  reviewCountdownSeconds: 5,
  rewards: [
    {
      id: 'livraison_1_semaine',
      label: 'Livraison offerte pendant 1 semaine',
      wheelLabel: 'Livraison offerte 1 semaine',
      type: 'reward',
      code: 'LIVRAISON7',
      detail: 'Valable pendant 7 jours. Minimum de commande conseillé : 25€.',
      image: 'assets/rewards/livraison-offerte-1-semaine.png',
      weight: 15,
      wheelCenterDeg: 0
    },
    {
      id: 'tampon_fidelite',
      label: '1 tampon sur la carte de fidélité',
      wheelLabel: '1 tampon fidélité',
      type: 'reward',
      code: 'TAMPON1',
      detail: 'À présenter lors de votre prochaine commande pour ajouter un tampon.',
      image: 'assets/rewards/1-tampon-fidelite.png',
      weight: 25,
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
      weight: 20,
      wheelCenterDeg: 102.857142
    },
    {
      id: 'reduction_10',
      label: 'Bon de réduction de 10€',
      wheelLabel: 'Bon de réduction 10€',
      type: 'reward',
      code: 'BON10',
      detail: 'Valable sur la prochaine commande.',
      image: 'assets/rewards/bon-reduction-10.png',
      weight: 15,
      wheelCenterDeg: 154.285713
    },
    {
      id: 'softs_offerts',
      label: '2 softs offerts au choix',
      wheelLabel: '2 softs offerts',
      type: 'reward',
      code: 'SOFT2',
      detail: 'Donne droit à deux softs au choix lors de la commande.',
      image: 'assets/rewards/2-softs-offerts.png',
      weight: 15,
      wheelCenterDeg: 205.714284
    },
    {
      id: 'code_adn66_10',
      label: 'Code promo ADN66 -10%',
      wheelLabel: 'Code promo ADN66 -10%',
      type: 'reward',
      code: 'ADN66',
      detail: 'Code valable sur le site internet.',
      image: 'assets/rewards/code-promo-adn66-10.png',
      weight: 8,
      wheelCenterDeg: 257.142855
    },
    {
      id: 'cadeau_surprise',
      label: 'Cadeau surprise',
      wheelLabel: 'Cadeau surprise',
      type: 'reward',
      code: 'SURPRISE',
      detail: 'Le cadeau surprise sera confirmé lors de votre prochaine commande.',
      image: 'assets/rewards/cadeau-surprise.png',
      weight: 2,
      wheelCenterDeg: 308.571426
    }
  ]
};
