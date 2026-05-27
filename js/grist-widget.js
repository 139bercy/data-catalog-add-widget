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
  var allBureaux = [];
  var lastLoadedRecord = null;
  var lastLoadedRawRecord = null;

  // Mapping des colonnes Grist vers les IDs du formulaire HTML
  var FIELD_MAP = {
    'Titre': 'titre',
    'Description': 'description',
    'URL': 'url',
    'Mots_Cles': 'mots-cles',
    'Statut_Publication': 'statut-publication',
    'Niveau_Sensibilite': 'niveau-sensibilite',
    'Domaine_Fonctionnel': 'domaine-fonctionnel',
    
    // Niveau 2
    'Langue': 'langue',
    'Couverture_Geo': 'couverture-geo',
    'Periode_de_couverture_Date_de_debut': 'periode-debut',
    'Periode_de_couverture_Date_de_fin': 'periode-fin',

    // Niveau 3
    'Organisation': 'organisation',
    'Service': 'service',
    'Bureau_Producteur': 'bureau-producteur',
    'Commanditaire': 'commanditaire',
    'Systeme_d_Information': 'systeme-information',
    'Frequence_MaJ': 'frequence-maj',
    'Date_Publication': 'date-publication',
    'Date_MaJ': 'date-maj',

    // Niveau 4
    'Contact_Service': 'contact-service',
    'Contact': 'contact',

    // Niveau 5
    'URL_de_telechargement': 'url-telechargement',
    'Format_Donnees': 'format-donnees',
    'Licence': 'licence',
    'Volumetrie_en_Mo_': 'volumetrie',
    'Donnees_ouvertes': 'donnees-ouvertes',
    'URL_Open_Data': 'url-open-data',

    // Niveau 6
    'Statut_Qualification': 'statut-qualification',
  };

  // === Helpers pour décoder les types de référence de Grist ===

  /**
   * Extrait l'ID numérique d'une référence Grist de manière robuste.
   * Grist retourne les références sous différents formats selon le contexte :
   * - Un simple ID (ex: 12)
   * - Un tableau (ex: ["R", "Ref_Entite", 12])
   * - Un objet (ex: { id: 12 })
   * - null ou undefined
   */
  function parseGristReferenceId(value) {
    if (value === null || value === undefined || value === 0) return null;
    
    // Cas 1 : Nombre simple ou chaîne numérique
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && !isNaN(Number(value))) return Number(value);
    
    // Cas 2 : Tableau standard de référence Grist ["R", "TableName", id]
    if (Array.isArray(value)) {
      if (value[0] === 'R' && value.length >= 3) {
        return Number(value[2]);
      }
      if (value.length > 0) {
        var lastEl = value[value.length - 1];
        if (typeof lastEl === 'number') return lastEl;
        if (lastEl !== null && lastEl !== undefined && !isNaN(Number(lastEl))) return Number(lastEl);
      }
    }
    
    // Cas 3 : Objet avec clé "id"
    if (typeof value === 'object') {
      if (value.id !== undefined && value.id !== null) {
        return Number(value.id);
      }
    }
    
    return null;
  }

  /**
   * Extrait un tableau d'IDs numériques d'une ReferenceList ou ChoiceList Grist.
   * Supporte les formats :
   * - ["L", ["R", "Table", id1], ["R", "Table", id2]]
   * - ["L", id1, id2]
   * - [id1, id2]
   */
  function parseGristReferenceListIds(value) {
    if (value === null || value === undefined) return [];
    if (!Array.isArray(value)) {
      var singleId = parseGristReferenceId(value);
      return singleId !== null ? [singleId] : [];
    }
    
    // Enlever le marqueur de liste Grist ("L") s'il est présent
    var list = value[0] === 'L' ? value.slice(1) : value;
    var ids = [];
    for (var i = 0; i < list.length; i++) {
      var id = parseGristReferenceId(list[i]);
      if (id !== null) {
        ids.push(id);
      }
    }
    return ids;
  }

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
          
          // Niveau 2
          { name: 'Langue', type: 'Choice', title: 'Langue', optional: true },
          { name: 'Couverture_Geo', type: 'RefList', title: 'Couverture géographique (Ref_GeographicalCoverage)', optional: true },
          { name: 'Periode_de_couverture_Date_de_debut', type: 'Date', title: 'Début de couverture', optional: true },
          { name: 'Periode_de_couverture_Date_de_fin', type: 'Date', title: 'Fin de couverture', optional: true },

          // Niveau 3
          { name: 'Organisation', type: 'Ref', title: 'Organisation (Ref_Organisation)', optional: true },
          { name: 'Service', type: 'Ref', title: 'Service (Ref_Service)', optional: true },
          { name: 'Bureau_Producteur', type: 'Ref', title: 'Bureau producteur (Ref_Entite)', optional: true },
          { name: 'Commanditaire', type: 'Text', title: 'Commanditaire', optional: true },
          { name: 'Systeme_d_Information', type: 'RefList', title: 'Systèmes d\'information (Ref_InformationSystem)', optional: true },
          { name: 'Frequence_MaJ', type: 'Ref', title: 'Fréquence de mise à jour (Ref_Frequency)', optional: true },
          { name: 'Date_Publication', type: 'Date', title: 'Date de publication', optional: true },
          { name: 'Date_MaJ', type: 'Date', title: 'Date de dernière MaJ', optional: true },

          // Niveau 4
          { name: 'Contact_Service', type: 'Ref', title: 'Point de contact service (Ref_ContactPoint)', optional: true },
          { name: 'Contact', type: 'Ref', title: 'Contact principal (Ref_Utilisateur)', optional: true },

          // Niveau 5
          { name: 'URL_de_telechargement', type: 'Text', title: 'URL de téléchargement direct', optional: true },
          { name: 'Format_Donnees', type: 'RefList', title: 'Format des données (Ref_Format)', optional: true },
          { name: 'Licence', type: 'Ref', title: 'Licence juridique (Ref_Licence)', optional: true },
          { name: 'Volumetrie_en_Mo_', type: 'Numeric', title: 'Volumétrie en Mo', optional: true },
          { name: 'Donnees_ouvertes', type: 'Bool', title: 'Données ouvertes', optional: true },
          { name: 'URL_Open_Data', type: 'Text', title: 'URL Open Data', optional: true },

          // Niveau 6
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

    function rehydrateIfRecordLoaded() {
      var recordToLoad = lastLoadedRecord || lastLoadedRawRecord;
      if (recordToLoad) {
        populateFormFromRecord(recordToLoad);
      }
    }

    // 1. Ref_Utilisateur
    fetchTable('Ref_Utilisateur').then(function (data) {
      console.log('[Grist Widget] Ref_Utilisateur chargé :', data.id.length, 'utilisateurs');
      populateSelect('contact', data.id, data.Nom, data.Prenom);
      rehydrateIfRecordLoaded();
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Utilisateur :', err.message);
    });

    // 2. Ref_Entite
    fetchTable('Ref_Entite').then(function (data) {
      console.log('[Grist Widget] Ref_Entite chargé :', data.id.length, 'entités');
      allBureaux = [];
      var noms = data.Nom || data.Nom_Complet || data.Nom_Principal;
      var chemins = data.Chemin || noms;
      var balfs = data.BALF || [];
      for (var i = 0; i < data.id.length; i++) {
        allBureaux.push({
          id: data.id[i],
          nom: noms[i] || '',
          chemin: chemins[i] || noms[i] || '',
          balf: balfs[i] || ''
        });
      }
      allBureaux.sort(function (a, b) {
        return a.chemin.localeCompare(b.chemin);
      });
      setupBureauSearch();

      // Si un record a été chargé avant la fin du chargement des bureaux, ré-hydrate le champ
      var recordToLoad = lastLoadedRecord || lastLoadedRawRecord;
      if (recordToLoad) {
        var el = document.getElementById('bureau-producteur');
        if (el) {
          var selectedId = parseGristReferenceId(recordToLoad.Bureau_Producteur);
          var found = allBureaux.find(function (b) { return b.id === selectedId; });
          el.value = found ? found.chemin : '';
          updateDeducedBalf(selectedId);
        }
      }
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Entite :', err.message);
    });

    // 3. Ref_Theme
    fetchTable('Ref_Theme').then(function (data) {
      console.log('[Grist Widget] Ref_Theme chargé :', data.id.length, 'thèmes');
      populateSelect('domaine-fonctionnel', data.id, data.valeur);
      rehydrateIfRecordLoaded();
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Theme :', err.message);
    });

    // 4. Ref_InformationSystem
    fetchTable('Ref_InformationSystem').then(function (data) {
      console.log('[Grist Widget] Ref_InformationSystem chargé :', data.id.length, 'systèmes');
      populateMultiSelect('systeme-information', data.id, data.SI);
      rehydrateIfRecordLoaded();
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_InformationSystem :', err.message);
    });


    // 7. Ref_Frequency
    fetchTable('Ref_Frequency').then(function (data) {
      console.log('[Grist Widget] Ref_Frequency chargé :', data.id.length, 'fréquences');
      populateSelect('frequence-maj', data.id, data.valeur);
      rehydrateIfRecordLoaded();
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Frequency :', err.message);
    });

    // 8. Ref_GeographicalCoverage
    fetchTable('Ref_GeographicalCoverage').then(function (data) {
      console.log('[Grist Widget] Ref_GeographicalCoverage chargé :', data.id.length, 'zones géo');
      populateMultiSelect('couverture-geo', data.id, data.valeur);
      rehydrateIfRecordLoaded();
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_GeographicalCoverage :', err.message);
    });

    // 9. Ref_Format
    fetchTable('Ref_Format').then(function (data) {
      console.log('[Grist Widget] Ref_Format chargé :', data.id.length, 'formats');
      populateMultiSelect('format-donnees', data.id, data.valeur);
      rehydrateIfRecordLoaded();
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Format :', err.message);
    });

    // 10. Ref_Licence
    fetchTable('Ref_Licence').then(function (data) {
      console.log('[Grist Widget] Ref_Licence chargé :', data.id.length, 'licences');
      populateSelect('licence', data.id, data.valeur);
      rehydrateIfRecordLoaded();
    }).catch(function (err) {
      console.warn('[Grist Widget] Impossible de charger Ref_Licence :', err.message);
    });

  }

  function getBureauIdFromChemin(chemin) {
    if (!chemin) return null;
    var found = allBureaux.find(function (b) { return b.chemin === chemin; });
    return found ? found.id : null;
  }

  function renderBureauxOptions(filterText) {
    var dropdown = document.getElementById('bureau-producteur-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';
    var filter = filterText ? String(filterText).toLowerCase() : '';

    var matches = [];
    for (var i = 0; i < allBureaux.length; i++) {
      var b = allBureaux[i];
      if (!filter || b.chemin.toLowerCase().indexOf(filter) !== -1) {
        matches.push(b);
      }
    }

    if (matches.length === 0) {
      dropdown.style.display = 'none';
      return;
    }

    // Limiter l'affichage aux 30 meilleurs résultats pour la fluidité
    var limit = Math.min(matches.length, 30);
    for (var j = 0; j < limit; j++) {
      (function (bureau) {
        var optionDiv = document.createElement('div');
        optionDiv.className = 'custom-autocomplete-option';
        optionDiv.textContent = bureau.chemin;
        
        optionDiv.addEventListener('mousedown', function (e) {
          // preventDefault évite le blur immédiat de l'input et garantit la prise en compte du clic
          e.preventDefault();
          var select = document.getElementById('bureau-producteur');
          if (select) {
            select.value = bureau.chemin;
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
          dropdown.style.display = 'none';
        });

        dropdown.appendChild(optionDiv);
      })(matches[j]);
    }

    dropdown.style.display = 'block';
  }

  function updateDeducedBalf(selectedId) {
    var displayEl = document.getElementById('contact-service-display');
    if (!displayEl) return;

    if (!selectedId) {
      displayEl.value = '';
      displayEl.placeholder = 'Sélectionnez un bureau producteur...';
      return;
    }

    var bureau = allBureaux.find(function (b) { return b.id === Number(selectedId); });
    if (bureau && bureau.balf) {
      displayEl.value = bureau.balf;
    } else {
      displayEl.value = '';
      displayEl.placeholder = 'Aucune boîte mail (BALF) renseignée pour ce bureau.';
    }
  }

  function setupBureauSearch() {
    var select = document.getElementById('bureau-producteur');
    var dropdown = document.getElementById('bureau-producteur-dropdown');
    if (!select || !dropdown) return;

    if (select.dataset.changeListenerAdded !== 'true') {
      // Ouvre/rafraîchit le dropdown au focus ou au clic
      select.addEventListener('focus', function () {
        renderBureauxOptions(select.value);
      });
      select.addEventListener('click', function () {
        renderBureauxOptions(select.value);
      });

      // Filtre au fur et à mesure de la frappe
      select.addEventListener('input', function () {
        renderBureauxOptions(select.value);
        var bureauId = getBureauIdFromChemin(select.value);
        updateDeducedBalf(bureauId);
      });

      select.addEventListener('change', function () {
        var bureauId = getBureauIdFromChemin(select.value);
        updateDeducedBalf(bureauId);
      });

      // Ferme le dropdown lorsque l'input perd le focus
      select.addEventListener('blur', function () {
        setTimeout(function () {
          dropdown.style.display = 'none';
        }, 150);
      });

      select.dataset.changeListenerAdded = 'true';
    }
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
    console.log('[Grist Widget] onRecordChange déclenché. Record brut :', JSON.stringify(record));
    console.log('[Grist Widget] onRecordChange déclenché. Mappings :', JSON.stringify(mappings));
    
    lastLoadedRawRecord = record;

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
      console.log('[Grist Widget] Record mappé avec succès :', JSON.stringify(mapped));
      lastLoadedRecord = mapped;
      populateFormFromRecord(mapped);
    } else if (record) {
      console.log('[Grist Widget] Pas de mappings ou mappings invalides. Utilisation du record brut.');
      lastLoadedRecord = record;
      populateFormFromRecord(record);
    }

    // Stocke l'ID du record courant pour la mise à jour
    currentRecordId = record ? record.id : null;
  }

  function populateFormFromRecord(record) {
    if (!record) return;
    console.log('[Grist Widget] populateFormFromRecord appelé avec le record :', JSON.stringify(record));
    if (lastLoadedRawRecord) {
      console.log('[Grist Widget] Record brut de repli :', JSON.stringify(lastLoadedRawRecord));
    }
    
    Object.keys(FIELD_MAP).forEach(function (gristField) {
      var formFieldId = FIELD_MAP[gristField];
      var el = document.getElementById(formFieldId);
      if (!el) return;

      // Recherche dans le record fourni, fallback sur le record brut si undefined (flexibilité complète)
      var value = record[gristField];
      if (value === undefined && lastLoadedRawRecord) {
        value = lastLoadedRawRecord[gristField];
        console.log('[Grist Widget] Champ', gristField, '-> Repli brut : ', JSON.stringify(value));
      } else {
        console.log('[Grist Widget] Champ', gristField, '-> Direct : ', JSON.stringify(value));
      }

      // Bureau producteur : cherche le chemin correspondant à l'ID reçu de Grist
      if (formFieldId === 'bureau-producteur') {
        var selectedId = parseGristReferenceId(value);
        var found = allBureaux.find(function (b) { return b.id === selectedId; });
        el.value = found ? found.chemin : '';
        updateDeducedBalf(selectedId);
        return;
      }

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
        var cleanList = [];
        var refListFields = ['couverture-geo', 'systeme-information', 'format-donnees'];
        if (refListFields.indexOf(formFieldId) !== -1) {
          cleanList = parseGristReferenceListIds(value);
        } else {
          // ChoiceList standard
          if (Array.isArray(value)) {
            cleanList = value[0] === 'L' ? value.slice(1) : value;
          } else if (value !== null && value !== undefined) {
            cleanList = [value];
          }
        }

        Array.from(el.options).forEach(function (option) {
          var optVal = option.value;
          option.selected = cleanList.indexOf(Number(optVal)) !== -1 || cleanList.indexOf(optVal) !== -1;
        });
      } else if (el.type === 'checkbox') {
        el.checked = Boolean(value);
      } else if (el.type === 'date') {
        el.value = value ? String(value).substring(0, 10) : '';
      } else if (el.tagName === 'SELECT') {
        // Choice / Reference simple
        var cleanValue = value;
        var refFields = ['domaine-fonctionnel', 'organisation', 'service', 'frequence-maj', 'contact-service', 'contact', 'licence'];
        if (refFields.indexOf(formFieldId) !== -1) {
          cleanValue = parseGristReferenceId(value);
        }
        el.value = (cleanValue !== null && cleanValue !== undefined) ? String(cleanValue) : '';
      } else {
        // Text / URL / textarea / numeric
        el.value = (value !== null && value !== undefined) ? value : '';
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
      function toDate(v) {
        if (!v || v === '') return null;
        return v; // Format YYYY-MM-DD natif
      }
      function toNumeric(v) {
        if (!v || v === '') return null;
        var n = Number(v);
        return isNaN(n) ? null : n;
      }

      var gristData = {
        'Titre': formData.Titre,
        'Description': formData.Description,
        'URL': formData.URL,
        'Mots_Cles': toGristList(formData.Mots_Cles),
        'Statut_Publication': formData.Statut_Publication,
        'Niveau_Sensibilite': toGristList(formData.Niveau_Sensibilite),
        'Domaine_Fonctionnel': toRef(formData.Domaine_Fonctionnel),
        
        // Niveau 2
        'Langue': formData.Langue,
        'Couverture_Geo': toGristList(toRefList(formData.Couverture_Geo)),
        'Periode_de_couverture_Date_de_debut': toDate(formData.Periode_de_couverture_Date_de_debut),
        'Periode_de_couverture_Date_de_fin': toDate(formData.Periode_de_couverture_Date_de_fin),

        // Niveau 3
        'Organisation': toRef(formData.Organisation),
        'Service': toRef(formData.Service),
        'Bureau_Producteur': getBureauIdFromChemin(formData.Bureau_Producteur) || toRef(formData.Bureau_Producteur),
        'Commanditaire': formData.Commanditaire,
        'Systeme_d_Information': toGristList(toRefList(formData.Systeme_d_Information)),
        'Frequence_MaJ': toRef(formData.Frequence_MaJ),
        'Date_Publication': toDate(formData.Date_Publication),
        'Date_MaJ': toDate(formData.Date_MaJ),

        // Niveau 4
        'Contact_Service': toRef(formData.Contact_Service),
        'Contact': toRef(formData.Contact),

        // Niveau 5
        'URL_de_telechargement': formData.URL_de_telechargement,
        'Format_Donnees': toGristList(toRefList(formData.Format_Donnees)),
        'Licence': toRef(formData.Licence),
        'Volumetrie_en_Mo_': toNumeric(formData.Volumetrie_en_Mo_),
        'Donnees_ouvertes': formData.Donnees_ouvertes,
        'URL_Open_Data': formData.URL_Open_Data,

        // Niveau 6
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

  window.clearFormForCreate = function () {
    currentRecordId = null;
    lastLoadedRecord = null;
    lastLoadedRawRecord = null;

    console.log('[Grist Widget] Formulaire délié de Grist (Prêt pour la création)');

    // Vider explicitement les champs non-standards
    var bureauInput = document.getElementById('bureau-producteur');
    if (bureauInput) {
      bureauInput.value = '';
    }

    var dropdown = document.getElementById('bureau-producteur-dropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
    }

    updateDeducedBalf(null);
  };

  // === Démarrage ===

  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGristWidget);
  } else {
    initGristWidget();
  }

})();
