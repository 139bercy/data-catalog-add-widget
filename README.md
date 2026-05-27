# Formulaire Catalogue de Données — Widget Grist

Ce widget permet de saisir et de modifier des jeux de données dans Grist conformément au profil DCAT-AP.

## Composants
* `index.html` : Interface utilisateur basée sur le Système de Design de l'État (DSFR).
* `js/formulaire.js` : Calcul en temps réel du score de complétude et du badge de maturité.
* `js/grist-widget.js` : Synchronisation bidirectionnelle avec la table `Catalogue` de Grist.

## Résilience Technique
* **Décodage hybride** : Le widget sélectionne automatiquement les options des menus déroulants (simple/multiple) en faisant correspondre soit l'ID numérique Grist, soit le libellé d'affichage textuel (ex: `"Licence Ouverte v2.0"`).
* **Correspondance partielle** : Supporte la recherche par sous-chaîne pour associer les formules d'affichage Grist (ex: `"Direction - SI"` est mappé sur le SI correspondant).
* **Hydratation asynchrone** : Ré-applique l'état du record dès que les tables de référence (`Ref_Entite`, `Ref_Theme`, etc.) ont fini de charger.
* **Repli brut (Fallback)** : Utilise les clés physiques de la table en cas de mapping incomplet ou inexistant dans l'interface Grist.
