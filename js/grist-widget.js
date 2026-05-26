/**
 * Widget Grist pour le formulaire de catalogage DCAT-AP
 *
 * Intègre le formulaire HTML dans Grist via le Grist Plugin API.
 * Supporte la création et l'édition de records dans la table Catalogue.
 *
 * Utilisation dans Grist :
 *   1. Déployer ce fichier sur GitHub Pages (HTTPS requis)
 *   2. Dans Grist : Widget > URL personnalisée > coller l'URL du déploiement
 *   3. Mapper les colonnes du formulaire sur les colonnes de la table Catalogue
 */

(function () {
  'use strict';

  var gristReady = false;
  var currentTable = null;
  var currentRecordId = null;
  var refTablesLoaded = false;

  // === Initialisation du widget Grist ===

  function initGristWidget() {
    // Vérifie si on est dans le contexte Grist
    if (typeof grist === 'undefined') {
      console.log('[Grist Widget] Mode hors Grist — le widget fonctionnera en mode standalone.');
      return;
    }

    try {
      // Demande l'accès complet (lecture + écriture)
      grist.ready({
        requiredAccess: 'full',
        columns: [
          { name: 'Titre', type: 'Text', title: 'Titre du dataset', optional: false },
          { name: 'Description', type: 'Text', title: 'Description', optional: false },
          { name: 'URL', type: 'Text', title: 'URL du dataset', optional: true },
          { name: 'Mots_Cles', type: 'ChoiceList', title: 'Mots-clés', optional: false },
          { name: 'Statut_Publication', type: 'Choice', title: 'Statut de publication', optional: true },
          { name: 'Niveau_Sensibilite', type: 'ChoiceList', title: 'Niveau de sensibilité', optional: true },
          { name: 'Domaine_Fonctionnel', type: 'Ref', title: 'Domaine fonctionnel (Ref_Theme)', optional: true },
          { name: 'Bureau_Producteur', type: 'Ref', title: 'Bureau producteur (Ref_Entite)', optional: true },
          { name: 'Systeme_d_Information', type: 'RefList', title: 'Système d\'information (Ref_InformationSystem)', optional: true },
          { name: 'Contact', type: 'Ref', title: 'Contact principal (Ref_Utilisateur)', optional: true },
          { name: 'Statut_Qualification', type: 'Choice', title: 'Statut de qualification', optional: true },
        ],
      });

      gristReady = true;
      console.log('[Grist Widget] grist.ready() appelé avec succès.');

      // Récupère la table Catalogue explicitement
      currentTable = grist.getTable('Catalogue');
      console.log('[Grist Widget] Table Catalogue obtenue.');

      // Charge les tables de référence (contacts, etc.)
      loadRefTables();

      // Écoute les changements de record
      grist.onRecord(onRecordChange);

      // Écoute les changements de données
      grist.onRecords(onDataChange);

      console.log('[Grist Widget] Widget initialisé avec succès.');
    } catch (err) {
      console.error('[Grist Widget] Erreur d\'initialisation :', err);
    }
  }

  // === Chargement des tables de référence ===

  function loadRefTables() {
    console.log('[Grist Widget] Chargement des tables de référence...');

    // Utilise grist.docApi.fetchTable si disponible, fallback sur grist.fetchTable
    function fetchTable(name) {
      if (grist.docApi && typeof grist.docApi.fetchTable === 'function') {
        return grist.docApi.fetchTable(name);
      }
      if (typeof grist.fetchTable === 'function') {
        return grist.fetchTable(name);
      }
      return Promise.reject(new Error("DocAPI fetchTable n'est pas disponible"));
    }

    fetchTable('Ref_Utilisateur').then(function (data) {
      console.log('[Grist Widget] Ref_Utilisateur chargé :', data.id.length, 'utilisateurs');
      populateSelect('contact', data.id, data.Nom, data.Prenom);
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Utilisateur :', err.message);
    });

    fetchTable('Ref_Entite').then(function (data) {
      console.log('[Grist Widget] Ref_Entite chargé :', data.id.length, 'entités');
      populateSelect('bureau-producteur', data.id, data.Nom || data.Nom_Complet || data.Nom_Principal);
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Entite :', err.message);
    });

    fetchTable('Ref_Theme').then(function (data) {
      console.log('[Grist Widget] Ref_Theme chargé :', data.id.length, 'thèmes');
      populateSelect('domaine-fonctionnel', data.id, data.valeur);
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Theme :', err.message);
    });

    fetchTable('Ref_InformationSystem').then(function (data) {
      console.log('[Grist Widget] Ref_InformationSystem chargé :', data.id.length, 'systèmes');
      populateMultiSelect('systeme-information', data.id, data.SI);
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_InformationSystem :', err.message);
    });
  }

  /**
   * Remplit un <select> avec les données d'une table Grist.
   * @param {string} selectId - ID de l'élément <select>
   * @param {number[]} ids - Tableau des IDs de records
   * @param {string[]} noms - Tableau des noms (colonne Nom ou Nom_Complet)
   * @param {string[]} prenoms - Tableau des prénoms (optionnel)
   */
  function populateSelect(selectId, ids, noms, prenoms) {
    var select = document.getElementById(selectId);
    if (!select) return;

    // Garde l'option par défaut
    var defaultOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (defaultOption) select.appendChild(defaultOption);

    for (var i = 0; i < ids.length; i++) {
      var option = document.createElement('option');
      option.value = String(ids[i]);
      var label = prenoms && prenoms[i] ? prenoms[i] + ' ' + noms[i] : noms[i];
      option.textContent = label;
      select.appendChild(option);
    }
  }

  /**
   * Remplit un <select multiple> avec les données d'une table Grist.
   * @param {string} selectId - ID de l'élément <select>
   * @param {number[]} ids - Tableau des IDs de records
   * @param {string[]} noms - Tableau des noms
   */
  function populateMultiSelect(selectId, ids, noms) {
    var select = document.getElementById(selectId);
    if (!select) return;

    // Garde l'option par défaut
    var defaultOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (defaultOption) select.appendChild(defaultOption);

    for (var i = 0; i < ids.length; i++) {
      var option = document.createElement('option');
      option.value = String(ids[i]);
      option.textContent = noms[i];
      select.appendChild(option);
    }
  }

  // === Gestion des records ===

  function onRecordChange(record, mappings) {
    // Mapping des colonnes Grist vers les IDs du formulaire HTML
    var fieldMap = {
      'Titre': 'titre',
      'Description': 'description',
      'URL': 'url',
      'Mots_Cles': 'mots-cles',
      'Statut_Publication': 'statut-publication',
      'Niveau_Sensibilite': 'niveau-sensibilite',
      'Domaine_Fonctionnel': 'domaine-fonctionnel',
      'Bureau_Producteur': 'bureau-producteur',
      'Systeme_d_Information': 'systeme-information',
      'Contact': 'contact',
      'Statut_Qualification': 'statut-qualification',
    };

    // Si mappings sont disponibles, les utiliser pour le nommage flexible
    if (mappings) {
      var mapped = grist.mapColumnNames(record, {
        columns: grist.ready.columns,
        mappings: mappings,
      });
      if (!mapped) {
        console.warn('[Grist Widget] Colonnes non mappées. Veuillez mapper les colonnes du formulaire.');
        return;
      }
      populateFormFromRecord(mapped, fieldMap);
    } else if (record) {
      populateFormFromRecord(record, fieldMap);
    }

    // Stocke l'ID du record courant pour la mise à jour
    currentRecordId = record ? record.id : null;
  }

  function populateFormFromRecord(record, fieldMap) {
    Object.keys(fieldMap).forEach(function (gristField) {
      var formFieldId = fieldMap[gristField];
      var el = document.getElementById(formFieldId);
      if (!el) return;

      var value = record[gristField];

      // Mots-clés : ChoiceList Grist → texte séparé par virgules
      if (formFieldId === 'mots-cles') {
        if (Array.isArray(value)) {
          var cleanTags = value[0] === 'L' ? value.slice(1) : value;
          el.value = cleanTags.join(', ');
        } else if (typeof value === 'string') {
          el.value = value;
        }
        return;
      }

      if (el.tagName === 'SELECT' && el.hasAttribute('multiple')) {
        // ChoiceList / ReferenceList : sélectionne les options correspondantes
        // Les IDs Grist sont des numbers, option.value est un string → coercion
        if (Array.isArray(value)) {
          var cleanList = value[0] === 'L' ? value.slice(1) : value;
          Array.from(el.options).forEach(function (option) {
            var optVal = option.value;
            option.selected = cleanList.indexOf(Number(optVal)) !== -1 || cleanList.indexOf(optVal) !== -1;
          });
        }
      } else if (el.tagName === 'SELECT') {
        // Choice / Reference simple → coerce en string pour match option.value
        el.value = (value !== null && value !== undefined) ? String(value) : '';
      } else {
        // Text / URL / textarea
        el.value = value || '';
      }
    });

    // Recalcule le score et le badge
    if (typeof window.calculateScore === 'function') {
      window.calculateScore();
    }
    if (typeof window.calculateBadge === 'function') {
      window.calculateBadge();
    }
  }

  function onDataChange(records) {
    // Les données ont changé — pas d'action spécifique nécessaire
    // Le widget se met à jour via onRecordChange
  }

  // === Soumission des données ===

  window.submitToGrist = function (formData, callback) {
    if (!gristReady) {
      console.error('[Grist Widget] gristReady = false (grist.ready() n\'a pas abouti)');
      console.error('[Grist Widget] typeof grist =', typeof grist);
    }
    if (!currentTable) {
      console.error('[Grist Widget] currentTable = null — aucune table sélectionnée');
    }
    if (!gristReady || !currentTable) {
      var parts = [];
      if (!gristReady) parts.push('grist.ready() non appelé');
      if (!currentTable) parts.push('currentTable est null');
      var err = new Error('Widget Grist non initialisé : ' + parts.join(', ') + '. Vérifiez que les colonnes de la table Catalogue correspondent aux champs du formulaire.');
      if (callback) callback(err, null);
      return;
    }

    try {
      // Mapping inverse : formulaire → colonnes Grist
      // Les select values sont des strings, mais Grist attend des numbers pour References
      function toRef(v) {
        if (!v || v === '') return null;
        var n = Number(v);
        return isNaN(n) ? null : n;
      }
      function toRefList(arr) {
        if (!Array.isArray(arr)) return [];
        return arr.map(function (v) { var n = Number(v); return isNaN(n) ? null : n; }).filter(function (v) { return v !== null; });
      }
      function toGristList(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        return ['L'].concat(arr);
      }

      var gristData = {
        'Titre': formData.Titre,
        'Description': formData.Description,
        'URL': formData.URL,
        'Mots_Cles': toGristList(formData.Mots_Cles),
        'Statut_Publication': formData.Statut_Publication,
        'Niveau_Sensibilite': toGristList(formData.Niveau_Sensibilite),
        'Domaine_Fonctionnel': toRef(formData.Domaine_Fonctionnel),
        'Bureau_Producteur': toRef(formData.Bureau_Producteur),
        'Systeme_d_Information': toGristList(toRefList(formData.Systeme_d_Information)),
        'Contact': toRef(formData.Contact),
        'Statut_Qualification': formData.Statut_Qualification,
      };

      if (currentRecordId) {
        // Mode édition : mise à jour du record courant
        currentTable.update({
          id: currentRecordId,
          fields: gristData,
        }).then(function (result) {
          console.log('[Grist Widget] Record mis à jour (id:', currentRecordId, ')');
          if (callback) callback(null, result);
        }).catch(function (err) {
          console.error('[Grist Widget] Erreur mise à jour :', err);
          if (callback) callback(err, null);
        });
      } else {
        // Mode création : nouveau record
        currentTable.create({
          fields: gristData,
        }).then(function (result) {
          console.log('[Grist Widget] Nouveau record créé (id:', result.id, ')');
          if (callback) callback(null, result);
        }).catch(function (err) {
          console.error('[Grist Widget] Erreur création :', err);
          if (callback) callback(err, null);
        });
      }
    } catch (err) {
      console.error('[Grist Widget] Erreur de collecte des données :', err);
      if (callback) callback(err, null);
    }
  };

  // === Démarrage ===

  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGristWidget);
  } else {
    initGristWidget();
  }

})();
