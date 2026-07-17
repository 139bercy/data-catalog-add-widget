# Fiche pratique — Cataloguer un jeu de données

## À quoi sert le catalogue ?

Le catalogue de données des MEF est un classeur Grist partagé permettant de cartographier, qualifier et mettre à disposition les jeux de données produits par les bureaux et directions des ministères économiques et financiers.

Il répond à trois enjeux :

- **Découvrabilité** : un consommateur doit pouvoir trouver vos données en cherchant par mot-clé, thématique ou bureau producteur.
- **Conformité** : inventaire du patrimoine documentaire (RIP, art. L322-6 CRPA), registre des traitements (RGPD, art. 30).
- **Confiance** : chaque fiche indique qui produit, qui contacter, quelle est la sensibilité et la fraîcheur des données.

Lien d'accès : [Catalogue Grist MEF](https://grist.numerique.gouv.fr/o/catalogue/fWWMJ5ZVPQ5o/Data-Catalog-MEF)

## Pour le commanditaire (Chef de bureau / Direction)

Cette section s'adresse au responsable de la publication au sein de l'entité. Elle définit le périmètre de la saisie et l'organisation interne pour mener à bien le catalogage.

### Qu'est-ce qu'un "jeu de données" (périmètre) ?

Un **jeu de données (dataset)** est une collection cohérente de données structurées (lignes/colonnes, fichiers connexes) répondant à une même thématique ou un même processus métier (ex: *Dépenses PLF 2025*, *Annuaire des entités*).

*   **À cataloguer** : Les tables de données pérennes, les référentiels métiers, les bases de données de production ou d'études.
*   **À ne pas cataloguer** : Les simples documents bureautiques de travail temporaire, les présentations PowerPoint, ou les rapports d'analyse textuels (sauf s'ils accompagnent un jeu de données en tant que pièce jointe).

### Qui désigner dans mon équipe pour la saisie ?

La saisie des métadonnées nécessite avant tout une **connaissance métier** de la donnée plutôt que des compétences techniques en informatique ou en data science.
*   **Profil recommandé** : Un chargé d'études, un gestionnaire d'application ou un assistant administratif familier avec le sujet traité.
*   **Compétences requises** : Savoir d'où vient la donnée, qui l'utilise, sa fréquence de mise à jour, et son niveau de sensibilité.

### Circuit de validation et gouvernance

1.  **Désignation** : Le commanditaire désigne le saisisseur et lui transmet les accès (via le kit d'onboarding).
2.  **Saisie** : Le saisisseur remplit la fiche (idéalement jusqu'au Niveau 3 ou 4) et la laisse au statut `À vérifier (métier)` ou `En cours`.
3.  **Validation interne** : Le commanditaire valide l'exactitude des métadonnées métiers.
4.  **Qualification AMDAC** : La mission AMDAC [amd@finances.gouv.fr](mailto:amd@finances.gouv.fr) effectue un audit de qualité et passe le statut à `Qualifié` ou `Certifié`.

---

## Comment accéder au formulaire

1. Ouvrir le lien ci-dessus dans votre navigateur.
2. Dans la barre de tables (en haut à gauche de Grist), cliquer sur le bouton **Je veux saisir une donnée** (widget formulaire).
3. Le formulaire s'ouvre. Deux modes sont disponibles :

| Mode | Comportement |
|------|-------------|
| **Express** (défaut) | Seuls les champs du Niveau 1 (Identification) sont visibles. Le reste est masqué. |
| **Avancé** | Toutes les sections sont ouvertes. Permet de remplir le catalogue en une fois. |

Pour changer de mode, cliquer sur le bouton **Mode Avancé** / **Mode Express** en haut à droite du formulaire.

---

## Structure du formulaire : 5 niveaux progressifs

Le formulaire est divisé en 5 sections, chacune correspondant à un niveau de saturation des métadonnées. Vous pouvez vous arrêter à n'importe quel niveau, mais plus vous remplissez, plus vos données seront découvrables et fiables, notamment par les IA !

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

**Astuce bureau producteur** : le champ accepte la frappe libre avec filtrage automatique. Tapez les premières lettres de votre bureau pour faire apparaître les correspondances dans l'arborescence. Le **point de contact service (BALF)** se remplit automatiquement à partir de la boîte fonctionnelle (BALF) du bureau sélectionné. Sinon, il faudra penser à le renseigner dans la table [Entités](https://grist.numerique.gouv.fr/o/data-catalog-mef/jRe26weQFnz8/Catalogue/p/26). 

**Qu'est-ce qu'un bon Titre ?**

*   **Longueur** : 5 à 10 mots, maximum 170 caractères.
*   **Règle** : Il doit être explicite pour une personne externe à votre bureau. Évitez les acronymes internes non explicités.
*   *Exemple à éviter* : `Base PLF final v2`
*   *Exemple recommandé* : `Dépenses du Projet de Loi de Finances (PLF) par programme budgétaire`

**Qu'est-ce qu'une bonne Description ?**

*   **Longueur** : 300 à 500 caractères (environ un paragraphe).
*   **Contenu** : Expliquez l'objectif du jeu de données, la population concernée, l'origine de la collecte et les éventuelles limites d'utilisation. Explicitez systématiquement les termes ou notions techniques complexes.
*   *Exemple recommandé* : `Ce jeu de données retrace l'ensemble des crédits de paiement et des autorisations d'engagement votés dans le cadre du Projet de Loi de Finances (PLF) pour l'année civile. Il détaille les montants par programme budgétaire et par ministère, permettant de suivre les orientations budgétaires de l'État.`

**Qu'est-ce qu'un bon ensemble de Mots-clés ?**

*   **Quantité** : 3 à 7 mots-clés, séparés par des virgules.
*   **Règle** : Utilisez des termes génériques et des synonymes usuels.
*   *Exemple recommandé* : `fiscalité, budget de l'Etat, plf, dépenses publiques, comptabilité publique`

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

## ❓ Foire Aux Questions (FAQ) pour les novices

> [!NOTE]
> Cette section rassemble les réponses aux questions les plus fréquentes posées lors de la prise en main de l'outil.

### 1. Statut de publication vs Niveau de sensibilité : quelle différence ?

*   **Statut de publication** : C'est le statut de la donnée vis-à-vis de sa mise à disposition générale (`Données ouvertes`, `Données fermées`, `Données réglementées`).
*   **Niveau de sensibilité** : C'est la nature de la protection juridique ou de sécurité requise (`Open data`, `Diffusion restreinte`, `Confidentiel`).
*   *Exemple* : Un jeu de données contenant des informations confidentielles ou personnelles doit avoir un niveau de sensibilité `Données personnelles (RGPD)` ou `Confidentiel`, et un statut de publication à `Données fermées`.

### 2. Si je mets "Diffusion restreinte", ma donnée est-elle visible par tout le monde ?

**Non**. Le fait de renseigner une fiche de métadonnées dans le catalogue permet aux autres agents de savoir que le jeu de données **existe** (découvrabilité) et de savoir **qui contacter** pour en demander l'accès. Toutefois, les données elles-mêmes (fichiers sources) ne sont en aucun cas publiées ou rendues accessibles sans autorisation.

### 3. Pourquoi me demande-t-on deux types d'URL ?

*   **URL du dataset** : Pointeur vers la page d'information, le portail ou l'application métier d'origine (ex: page de présentation Alizée).
*   **URL de téléchargement direct** : Lien direct permettant de télécharger le fichier brut (ex: lien `.csv`, `.xlsx`, ou API). Si la donnée n'est pas téléchargeable en un clic, laissez ce champ vide.

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

## ⚡ Pour aller plus loin (Profils Expérimentés / Data)

Cette section s'adresse aux administrateurs de données, correspondants data, et agents habitués aux concepts d'architecture de données.

### Rôle et articulation du catalogue Grist

Le catalogue Grist MEF sert de **point d'entrée unique et de pivot** pour le référencement du patrimoine de données.
*   **Moissonnage & Standardisation** : Les métadonnées saisies respectent le standard **DCAT-AP**.
*   **Lien Opendatasoft (ODS) / data.gouv.fr** : Le catalogue Grist sera synchronisé périodiquement avec les plateformes de publication open data. Les fiches qualifiées `Données ouvertes` y seront automatiquement indexées.
*   **Éviter la double saisie** : Les fiches en provenance de ces plateformes seront chargées en lecture seule pour éviter tout conflit de version. Les mises à jour s'effectueront à la source.

### Gouvernance et évolution

L'outil est collaboratif. Si vous souhaitez :
*   Proposer des évolutions de schémas (nouveaux champs, nouvelles listes de référence).
*   Suggérer des intégrations d'API ou de flux automatisés.
*   Rejoindre la communauté des correspondants data du MEF.

Contactez l'administrateur système (AMDAC) via le canal Tchap ou l'adresse [amd@finances.gouv.fr](mailto:amd@finances.gouv.fr).

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
