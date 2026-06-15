# Fiche pratique — Cataloguer un jeu de données

## À quoi sert le catalogue ?

Le catalogue de données du MEF est un classeur Grist partagé qui permet de cartographier, qualifier et mettre à disposition les jeux de données produits par les bureaux et directions des ministères économiques et financiers.

Il répond à trois enjeux :

- **Découvrabilité** : un consommateur doit pouvoir trouver vos données en cherchant par mot-clé, thématique ou bureau producteur.
- **Conformité** : inventaire du patrimoine documentaire (RIP, art. L322-6 CRPA), registre des traitements (RGPD, art. 30).
- **Confiance** : chaque fiche indique qui produit, qui contacter, quelle est la sensibilité et la fraîcheur des données.

Lien d'accès : [Catalogue Grist MEF](https://grist.numerique.gouv.fr/o/catalogue/fWWMJ5ZVPQ5o/Data-Catalog-MEF)

---

## Comment accéder au formulaire

1. Ouvrir le lien ci-dessus dans votre navigateur.
2. Dans la barre de tables (en haut à gauche de Grist), cliquer sur le bouton **Catalogue données** (widget formulaire).
3. Le formulaire s'ouvre. Deux modes sont disponibles :

| Mode | Comportement |
|------|-------------|
| **Express** (défaut) | Seuls les champs du Niveau 1 (Identification) sont visibles. Le reste est masqué. |
| **Avancé** | Toutes les sections sont ouvertes. Permet de remplir le catalogue en une fois. |

Pour changer de mode, cliquer sur le bouton **Mode Avancé** / **Mode Express** en haut à droite du formulaire.

---

## Structure du formulaire : 5 niveaux progressifs

Le formulaire est divisé en 5 sections, chacune correspondant à un niveau de saturation des métadonnées. Vous pouvez vous arrêter à n'importe quel niveau, mais plus vous remplissez, plus vos données seront découvrables et fiables.

### Niveau 1 — Identification (toujours visible)

C'est le minimum pour créer une fiche. Les champs marqués d'un astérisque (*) sont **obligatoires**.

| Label affiché | Type | Obligatoire | Source de référence |
|---------------|------|:-----------:|---------------------|
| **Titre** | Texte libre | * | `Titre` (Grist) |
| **Bureau producteur** | Recherche arborescente (autocomplétion) | * | `Bureau_Producteur` → Ref_Entité |
| **URL du dataset** | URL | | `URL` (Grist) |
| **Point de contact service (BALF)** | Texte lu en lecture seule | | Déduit automatiquement de la boîte fonctionnelle du bureau sélectionné |
| **Description** | Zone de texte (4 lignes) | * | `Description` (Grist) |
| **Mots-clés** | Texte libre (séparé par des virgules) | * | `Mots_Cles` (Grist) |

**Astuce bureau producteur** : le champ accepte la frappe libre avec filtrage automatique. Tapez les premières lettres de votre bureau pour faire apparaître les correspondances dans l'arborescence. Le **point de contact service (BALF)** se remplit automatiquement à partir de la boîte fonctionnelle (BALF) du bureau sélectionné.

**Titre** : 5 à 10 mots, pas plus de 170 caractères. Doit être explicite et contenir un vocabulaire métier compréhensible. Selon la [Charte Open Data](https://data.economie.gouv.fr), préférer le tiret court au tiret bas pour les identifiants techniques.

**Description** : 300 à 500 caractères. Brève description du contenu et de l'objectif du jeu de données. Selon le modèle *Datasheets for Datasets*.

**Mots-clés** : 3 à 7 mots-clés thématiques, séparés par des virgules. Exemple : `fiscalité, dépenses, indicateur, 2025`.

---

### Niveau 2 — Classification (accordéon)

Qualifie le jeu de données pour le tri et les filtres.

| Label affiché | Type | Valeurs possibles | Source de référence |
|---------------|------|-------------------|---------------------|
| **Statut de publication** | Liste déroulante | `Données ouvertes`, `Données fermées`, `Données réglementées` | `Statut_Publication` (Grist) |
| **Niveau de sensibilité** | Liste à sélection multiple | `Open data`, `Diffusion restreinte`, `Données personnelles (RGPD)`, `Diffusion contrainte`, `Confidentiel` | `Niveau_Sensibilite` (Grist) |
| **Domaine fonctionnel** | Liste déroulante | Sélectionner dans la liste chargée automatiquement | `Domaine_Fonctionnel` → Ref_Thème |
| **Langue du dataset** | Liste déroulante | `Français (FR)`, `Anglais (EN)`, `Allemand (DE)`, `Espagnol (ES)`, `Autre` | `Langue` (Grist) |
| **Couverture géographique** | Liste à sélection multiple | Chargée depuis Ref_GéographicalCoverage | `Couverture_Geo` (Grist) |
| **Période de couverture (Début)** | Sélecteur de date | Format `AAAA-MM-JJ` | `Periode_de_couverture_Date_de_debut` (Grist) |
| **Période de couverture (Fin)** | Sélecteur de date | Format `AAAA-MM-JJ` | `Periode_de_couverture_Date_de_fin` (Grist) |

---

### Niveau 3 — Organisation (accordéon)

Rattache le dataset à la structure ministérielle et aux systèmes d'information.

| Label affiché | Type | Source de référence |
|---------------|------|---------------------|
| **Contact principal** | Liste déroulante | `Contact` → Ref_Utilisateur |
| **Commanditaire / Propriétaire** | Texte libre | `Commanditaire` (Grist) |
| **Fréquence de mise à jour** | Liste déroulante | `Frequence_MaJ` → Ref_Frequency |
| **Système d'information** | Liste à sélection multiple | `Systeme_d_Information` → Ref_InformationSystem |
| **Date de publication** | Sélecteur de date | `Date_Publication` (Grist) |
| **Dernière mise à jour** | Sélecteur de date | `Date_MaJ` (Grist) |

---

### Niveau 4 — Technique & Distribution (accordéon)

Détails d'accès physique et informations techniques.

| Label affiché | Type | Source de référence |
|---------------|------|---------------------|
| **URL de téléchargement direct** | URL | `URL_de_telechargement` (Grist) |
| **Format des données** | Liste à sélection multiple | `Format_Donnees` → Ref_Format |
| **Licence juridique** | Liste déroulante | `Licence` → Ref_Licence |
| **Volumétrie (Mo)** | Nombre (décimal) | `Volumetrie_en_Mo_` (Grist) |
| **Données ouvertes (Open Data)** | Case à cocher | `Donnees_ouvertes` (Grist) |
| **URL Open Data** | URL | `URL_Open_Data` (Grist) |

> **Par défaut** : la **Licence Ouverte v2.0 (Etalab)** est recommandée pour tous les datasets ouverts (cf. [Charte Open Data](https://data.economie.gouv.fr)).

---

### Niveau 5 — Qualification (accordéon)

Auto-évaluation de la maturité des métadonnées. Cette section est visible mais les indicateurs se mettent à jour automatiquement.

| Label affiché | Type | Description |
|---------------|------|-------------|
| **Score de complétude** | Affichage calculé automatiquement | Pourcentage (0-100%) selon les champs remplis |
| **Badge de maturité** | Affichage calculé automatiquement | Indicateur de maturité basé sur le statut |
| **Statut de qualification** | Liste déroulante | `En cours`, `À vérifier (métier)`, `Qualifié`, `Certifié` |

---

## Comment remplir : pas à pas

### Cas 1 : saisie rapide (mode Express)

1. Ouvrir le formulaire.
2. Remplir les champs obligatoires du Niveau 1 (marqués *).
3. Cliquer sur **Enregistrer**.
4. La fiche est créée. Vous pourrez l'enrichir plus tard.

### Cas 2 : saisie complète (mode Avancé)

1. Basculer en **Mode Avancé** (bouton en haut à droite).
2. Remplir les sections dans l'ordre : Identification, Classification, Organisation, Technique, Qualification.
3. Vérifier le **score de complétude** dans la section Qualification : il monte au fur et à mesure.
4. Si le score est à 100%, passer en statut `Qualifié` ou `Certifié`.
5. Cliquer sur **Enregistrer**.

### Modifier une fiche existante

1. Dans la vue `Catalogue` de Grist, cliquer sur la ligne du dataset à modifier.
2. Le formulaire se remplit automatiquement avec les données existantes.
3. Modifier les champs nécessaires.
4. Cliquer sur **Enregistrer** pour sauvegarder.

### Créer une nouvelle fiche

1. Cliquer sur le bouton **Nouveau** (en haut à gauche du formulaire).
2. Le formulaire se réinitialise.
3. Remplir et enregistrer comme décrit ci-dessus.

---

## Bonnes pratiques

### Ce qu'il faut faire

- **Une fiche = un dataset**. Une fiche par jeu de données logique, pas par fichier ou par année (sauf si pertinent).
- **Soyez précis dans la description**. C'est le texte qui permet aux autres de comprendre ce que vous produisez.
- **Mettez au moins 3 mots-clés**. C'est le principal levier de découverte.
- **Remplissez le bureau producteur**. C'est ce qui rattache la fiche à votre organisation.
- **Mettez à jour la date de dernière modification** à chaque actualisation des données.
- **Indiquez la fréquence de mise à jour**. Un dataset "mensuel" est plus fiable qu'un dataset sans fréquence déclarée.

### Ce qu'il faut éviter

- **Laisser le titre vide ou trop générique**. `dataset-2025` n'est pas un titre utile.
- **Oublier les mots-clés**. Sans mots-clés, personne ne trouvera vos données.
- **Mettre des données sensibles sans déclarer la sensibilité**. Consultez le `Niveau de sensibilité`.
- **Remplir un champ si vous ne connaissez pas la réponse**. Laissez vide. On en reparle.
- **Confondre URL du dataset et URL de téléchargement**. L'URL du dataset est une page d'information. L'URL de téléchargement est le fichier lui-même (CSV, JSON, etc.).

---

## Comprendre le score de complétude

Le score se calcule automatiquement à partir de 15 champs cibles DCAT-AP :

```
Champs pris en compte (colonnes Grist) :
  Titre, Description, Mots_Cles, Statut_Publication,
  Niveau_Sensibilite, Domaine_Fonctionnel, Langue,
  Couverture_Geo, Bureau_Producteur, Systeme_d_Information,
  Frequence_MaJ, Contact, URL_de_telechargement,
  Format_Donnees, Licence
```

| Score | Signification |
|-------|---------------|
| **< 50%** | Fiche incomplète. À enrichir rapidement. |
| **50%-99%** | Fiche correcte mais perfectible. |
| **100%** | Fiche complète. Statut recommandée : `Qualifié` ou `Certifié`. |

Le score change en temps réel : chaque champ rempli fait monter le pourcentage.

---

## Conventions de nommage (Charte Open Data)

La [Charte Open Data des ministères économiques et financiers](https://data.economie.gouv.fr) impose des règles précises pour les noms et identifiants des jeux de données publiés sur **data.economie.gouv.fr** (plateforme Opendatasoft).

### Identifiant technique

L'identifiant technique est l'identifiant unique du dataset sur data.economie.gouv.fr et sur data.gouv.fr (qui le moissonne quotidiennement).

- Défini **avant** la publication, **ne pas le changer** après mise en production.
- Ne pas contenir de notions techniques propres à la plateforme (ex : `copie`, `nom_du_dataset0`).
- Préférer le **tiret court** (`-`) au **tiret bas** (`_`).
- En français courant.

### Préfixes d'environnement et de périmètre

| Préfixe | Usage | Exemple |
|---------|-------|---------|
| `test-` | Jeu de données de test | `test-prix-carburants-v2` |
| `preprod-` | Jeu de données de préproduction | `preprod-prix-carburants-v2` |
| `-restreint-` | Diffusion restreinte | `test-interne-prix-carburants-v2` |
| `-interne-` | Diffusion interne | `test-interne-prix-carburants-v2` |

L'absence de préfixe désigne la **production**.

### Structure cohérente pour un ensemble de datasets

Si les datasets appartiennent à un même ensemble, utiliser le même préfixe :

- `plf-2025-autorisations-decouverts-comptes-speciaux`
- `plf25-depenses-2025-comptes-speciaux-non-dotes`

### Versionnement (SemVer 2.0.0)

Chaque dataset publié doit avoir un numéro de version au format `<majeure>.<mineure>.<patch>` :

- **Majeure** : changement de schéma ou rupture de compatibilité
- **Mineure** : ajout de données ou de champs sans rupture
- **Patch** : correction d'erreurs

Documenter les modifications dans la description ou un fichier `CHANGELOG.txt`.

### Datasets millésimés

Préférer **un seul dataset** contenant l'historique sur plusieurs années (avec un champ `année`) plutôt que de créer un dataset par année. Cela facilite les comparaisons interannuelles.

Si le schéma évolue trop entre les années, il est acceptable de créer un dataset par année, avec une page référençant tous les datasets de la série.

### Licence par défaut

La licence par défaut est la **Licence Ouverte v2.0 (Etalab)**. Elle est recommandée pour tous les datasets ouverts.

---

## Suivi qualité

Un jeu de données mis à jour à une fréquence bi-hebdomadaire permet de suivre le taux de remplissage de vos métadonnées :

- [Admin : qualité des jeux de données publiés](https://data.economie.gouv.fr/explore/dataset/admin-qualite-des-jeux-de-donnees-publies)

Le `quality_score` est indicatif mais constitue un bon repère pour identifier les fiches à enrichir.

---

## Mode diagnostic (dépannage)

En bas du formulaire, une section **Diagnostic & Débogage Grist** est disponible. Elle affiche :

- L'ID du record courant (indique si vous êtes en création ou en édition).
- Le nombre de bureaux, contacts, thématiques et fréquences chargés depuis les tables de référence.
- Le record mappé (via FIELD_MAP) et le record brut (pour les techniciens).

Cette section est destinée au support technique. Si quelque chose ne fonctionne pas, ouvrez l'accordéon et partagez la capture avec l'AMDAC.

---

## Besoin d'aide ?

**Contact AMDAC** : [amd@finances.gouv.fr](mailto:amd@finances.gouv.fr)

Vous pouvez également demander un rendez-vous de 30 minutes pour remplir une fiche ensemble ou faire un point sur votre catalogue.

---

## Glossaire

| Terme | Définition |
|-------|-----------|
| **Dataset** | Jeu de données. Ensemble structuré d'informations sur un sujet métier donné. |
| **Métadonnées** | Données qui décrivent les données : titre, description, format, sensibilité, etc. |
| **DCAT-AP** | European Data Catalogue Application Profile. Standard européen pour les catalogues de données. |
| **Ref_Entité** | Table de référence contenant l'arborescence organisationnelle (bureaux, directions, etc.). |
| **Ref_Utilisateur** | Table de référence contenant les utilisateurs du catalogue (contacts). |
| **Ref_Thème** | Table de référence contenant les thématiques fonctionnelles. |
| **Ref_GéographicalCoverage** | Table de référence contenant les couvertures géographiques. |
| **Ref_Frequency** | Table de référence contenant les fréquences de mise à jour. |
| **Ref_InformationSystem** | Table de référence contenant les systèmes d'information. |
| **Ref_Format** | Table de référence contenant les formats de données. |
| **Ref_Licence** | Table de référence contenant les licences juridiques. |
| **BALF** | Boîte fonctionnelle. Adresse email professionnelle associée à un bureau. |
| **Grist** | Outil de base de données collaborative utilisé pour le catalogue. |
| **Widget** | Formulaire web intégré dans Grist pour la saisie des fiches. |
| **FIELD_MAP** | Mapping interne entre les colonnes Grist et les champs du formulaire HTML. |
| **RIP** | Répertoire des Informations Publiques. Inventaire obligatoire des informations publiques. |
| **data.economie.gouv.fr** | Plateforme Open Data des ministères économiques et financiers (Opendatasoft). |
| **data.gouv.fr** | Portail national des données publiques ouvertes. Moisssonage quotidien de data.economie.gouv.fr. |
