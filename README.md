# Roue de la fortune - Apéro de Nuit 66

Projet PWA statique complet pour GitHub Pages.

## Contenu

- `index.html` : page principale
- `styles.css` : design premium sombre / bleu néon / or
- `app.js` : logique du jeu
- `config.js` : configuration des lots, codes, chances et liens
- `manifest.webmanifest` : installation PWA
- `sw.js` : cache hors ligne simple
- `assets/` : logo, roue, fond, icônes et cartes de récompense

## Lots intégrés

1. Livraison offerte pendant 1 semaine
2. 1 tampon sur la carte de fidélité
3. Retourner la roue
4. Bon de réduction de 10€
5. 2 softs offerts au choix
6. Code promo ADN66 -10%
7. Cadeau surprise

## Fonctionnement

- Le client clique sur `Tourner la roue`.
- Une popup avis Google apparaît par-dessus la roue.
- La fermeture est bloquée pendant 5 secondes.
- Après validation, la roue tourne.
- Le lot est choisi par pondération dans `config.js`.
- Le gain est enregistré en local dans le navigateur pendant 90 jours.
- Le lot `Retourner la roue` permet de rejouer immédiatement sans verrouiller le client.

## Modifier les chances

Ouvrez `config.js`, puis modifiez les valeurs `weight`.

Exemple :

```js
weight: 25
```

Plus le chiffre est grand, plus le lot sort souvent.

## Modifier les codes

Toujours dans `config.js`, changez les valeurs `code`.

## Publication GitHub Pages

1. Créez un dépôt GitHub.
2. Envoyez tous les fichiers à la racine du dépôt.
3. Allez dans `Settings > Pages`.
4. Source : branche `main`, dossier `/root`.
5. Attendez la mise en ligne.

## Important

Cette version est 100% statique. Elle ne vérifie pas réellement qu'un avis Google a été publié et elle n'enregistre pas les gains dans une base Cloudflare D1.
Pour une version sécurisée, il faudra ajouter un Worker Cloudflare + D1.
