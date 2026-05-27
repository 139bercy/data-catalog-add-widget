/**
 * Logique du formulaire de catalogage DCAT-AP
 * - Toggle mode Express/Avancé
 * - Calcul du Score de complétude en temps réel
 * - Calcul du Badge de maturité
 * - Validation des champs requis
 */

(function () {
  'use strict';

  // === Constantes ===

  // Champs requis du Niveau 1 (Identification)
  const REQUIRED_FIELDS = ['titre', 'description', 'mots-cles'];

  // Champs utilisés dans la formule Score_Completude (schema-grist.md)
  const COMPLETENESS_FIELDS = [
    'titre',
    'description',
    'mots-cles',
    'statut-publication',
    'niveau-sensibilite',
    'domaine-fonctionnel',
    'langue',
    'couverture-geo',
    'bureau-producteur',
    'systeme-information',
    'frequence-maj',
    'contact',
    'url-telechargement',
    'format-donnees',
    'licence'
  ];

  // === DOM Elements ===

  const form = document.getElementById('catalogue-form');
  const toggleBtn = document.getElementById('toggle-mode');
  const modeLabel = document.getElementById('mode-label');
  const scoreEl = document.getElementById('score-completude');
  const badgeEl = document.getElementById('badge-maturite');
  const messagesEl = document.getElementById('form-messages');
  const submitBtn = document.getElementById('btn-submit');

  // Sections accordéon
  const accordions = document.querySelectorAll('.fr-accordion');

  // === Mode Express / Avancé ===

  let isExpressMode = false;

  function setExpressMode(enabled) {
    isExpressMode = enabled;
    toggleBtn.setAttribute('aria-pressed', String(enabled));
    modeLabel.textContent = enabled ? 'Express' : 'Avancé';

    if (enabled) {
      document.body.classList.add('mode-express');
      // Ferme tous les accordéons
      accordions.forEach(function (section) {
        var btn = section.querySelector('.fr-accordion__btn');
        var content = section.querySelector('.fr-collapse');
        if (btn && content) {
          btn.setAttribute('aria-expanded', 'false');
          content.classList.remove('fr-collapse--expanded');
        }
      });
    } else {
      document.body.classList.remove('mode-express');
      // Ouvre tous les accordéons
      accordions.forEach(function (section) {
        var btn = section.querySelector('.fr-accordion__btn');
        var content = section.querySelector('.fr-collapse');
        if (btn && content) {
          btn.setAttribute('aria-expanded', 'true');
          content.classList.add('fr-collapse--expanded');
        }
      });
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      setExpressMode(!isExpressMode);
    });
  }

  // === Calcul du Score de complétude ===

  function isFieldFilled(fieldId) {
    var el = document.getElementById(fieldId);
    if (!el) return false;

    // Mots-clés : champ texte libre, séparé par virgules
    if (fieldId === 'mots-cles') {
      var values = parseKeywords(el.value);
      return values.length > 0;
    }

    if (el.tagName === 'SELECT' && el.hasAttribute('multiple')) {
      // Pour les ChoiceList (mots-clés) : au moins une option sélectionnée
      var selected = Array.from(el.options).filter(function (o) { return o.selected; });
      return selected.length > 0;
    }

    return el.value !== '' && el.value !== null;
  }

  function calculateScore() {
    var filled = 0;
    var total = COMPLETENESS_FIELDS.length;

    COMPLETENESS_FIELDS.forEach(function (fieldId) {
      if (isFieldFilled(fieldId)) {
        filled++;
      }
    });

    var percentage = Math.round((filled / total) * 100);
    scoreEl.textContent = percentage + '%';

    // Couleur sémantique
    scoreEl.classList.remove('score-low', 'score-medium', 'score-high');
    if (percentage < 50) {
      scoreEl.classList.add('score-low');
    } else if (percentage < 100) {
      scoreEl.classList.add('score-medium');
    } else {
      scoreEl.classList.add('score-high');
    }

    return percentage;
  }

  // === Calcul du Badge de maturité ===

  function calculateBadge() {
    var statutEl = document.getElementById('statut-qualification');
    var statut = statutEl ? statutEl.value : '';

    var badgeText = 'Brouillon';
    var badgeClass = 'badge-brouillon';

    switch (statut) {
      case 'en-cours':
        badgeText = 'Brouillon';
        badgeClass = 'badge-brouillon';
        break;
      case 'a-verifier-metier':
        badgeText = 'À vérifier';
        badgeClass = 'badge-a-verifier';
        break;
      case 'qualifie':
        badgeText = 'Qualifié';
        badgeClass = 'badge-qualifie';
        break;
      case 'certifie':
        badgeText = 'Certifié';
        badgeClass = 'badge-certifie';
        break;
      default:
        badgeText = '—';
        badgeClass = '';
    }

    badgeEl.textContent = badgeText;
    badgeEl.classList.remove('badge-brouillon', 'badge-a-verifier', 'badge-qualifie', 'badge-certifie');
    if (badgeClass) {
      badgeEl.classList.add(badgeClass);
    }
  }

  // === Validation ===

  function validateForm() {
    var errors = [];

    REQUIRED_FIELDS.forEach(function (fieldId) {
      var el = document.getElementById(fieldId);
      if (!el) return;

      if (!isFieldFilled(fieldId)) {
        errors.push(fieldId);
      }
    });

    return errors;
  }

  function showMessages(messages) {
    messagesEl.innerHTML = '';
    messages.forEach(function (msg) {
      var alert = document.createElement('div');
      alert.className = 'fr-alert ' + msg.type;
      alert.innerHTML = '<p>' + msg.text + '</p>';
      messagesEl.appendChild(alert);
    });
  }

  function clearMessages() {
    messagesEl.innerHTML = '';
  }

  // === Écouteurs d'événements ===

  // Calcul en temps réel sur tous les champs
  var allInputs = form.querySelectorAll('input, select, textarea');
  allInputs.forEach(function (el) {
    var events = 'input change';
    if (el.tagName === 'SELECT' && el.hasAttribute('multiple')) {
      events = 'change';
    }
    el.addEventListener(events, function () {
      calculateScore();
      calculateBadge();
      clearMessages();
    });
  });

  // Statut de qualification → badge
  var statutQualification = document.getElementById('statut-qualification');
  if (statutQualification) {
    statutQualification.addEventListener('change', function () {
      calculateBadge();
    });
  }

  // Soumission du formulaire
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessages();

    var errors = validateForm();
    if (errors.length > 0) {
      var errorMessages = errors.map(function (fieldId) {
        var label = document.getElementById(fieldId);
        var labelText = label ? label.closest('.fr-input-group, .fr-select-group').querySelector('.fr-label').textContent.trim() : fieldId;
        return 'Le champ "' + labelText + '" est obligatoire.';
      });
      showMessages(errorMessages.map(function (text) {
        return { type: 'fr-alert--error', text: text };
      }));
      return;
    }

    // Collecte des données
    var data = collectFormData();

    // Envoi au widget Grist
    if (typeof window.submitToGrist === 'function') {
      submitBtn.disabled = true;
      submitBtn.classList.remove('fr-icon-save-line');
      submitBtn.innerHTML = '<span class="fr-spinner" aria-hidden="true"></span> Enregistrement...';

      window.submitToGrist(data, function (err, result) {
        submitBtn.disabled = false;
        submitBtn.classList.add('fr-icon-save-line');
        submitBtn.innerHTML = 'Enregistrer';

        if (err) {
          showMessages([{ type: 'fr-alert--error', text: 'Erreur lors de l\'enregistrement : ' + err.message }]);
        } else {
          showMessages([{ type: 'fr-alert--success', text: 'Enregistrement réussi !' }]);
          form.reset();
          calculateScore();
          calculateBadge();
        }
      });
    } else {
      // Mode hors Grist : log pour debug
      console.log('Données du formulaire :', data);
      showMessages([{ type: 'fr-alert--success', text: 'Formulaire prêt. Intégrez ce widget dans Grist pour l\'enregistrement.' }]);
      form.reset();
      calculateScore();
      calculateBadge();
    }
  });

  // === Utilitaires ===

  function parseKeywords(text) {
    if (!text) return [];
    return text.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s !== ''; });
  }

  // === Collecte des données ===

  function collectFormData() {
    function getSelectValues(selectId) {
      var el = document.getElementById(selectId);
      if (!el) return '';
      if (el.tagName === 'SELECT' && el.hasAttribute('multiple')) {
        return Array.from(el.options).filter(function (o) { return o.selected; }).map(function (o) { return o.value; });
      }
      return el.value;
    }

    return {
      Titre: document.getElementById('titre').value,
      Description: document.getElementById('description').value,
      URL: document.getElementById('url').value,
      Mots_Cles: parseKeywords(document.getElementById('mots-cles').value),
      Statut_Publication: getSelectValues('statut-publication'),
      Niveau_Sensibilite: getSelectValues('niveau-sensibilite'),
      Domaine_Fonctionnel: getSelectValues('domaine-fonctionnel'),
      
      // Niveau 2 - Classification
      Langue: getSelectValues('langue'),
      Couverture_Geo: getSelectValues('couverture-geo'),
      Periode_de_couverture_Date_de_debut: document.getElementById('periode-debut').value,
      Periode_de_couverture_Date_de_fin: document.getElementById('periode-fin').value,

      // Niveau 3 - Organisation
      Organisation: '',
      Service: '',
      Bureau_Producteur: getSelectValues('bureau-producteur'),
      Commanditaire: document.getElementById('commanditaire').value,
      Systeme_d_Information: getSelectValues('systeme-information'),
      Frequence_MaJ: getSelectValues('frequence-maj'),
      Date_Publication: document.getElementById('date-publication').value,
      Date_MaJ: document.getElementById('date-maj').value,

      // Niveau 4 - Contact
      Contact_Service: '',
      Contact: getSelectValues('contact'),

      // Niveau 5 - Technique & Distribution
      URL_de_telechargement: document.getElementById('url-telechargement').value,
      Format_Donnees: getSelectValues('format-donnees'),
      Licence: getSelectValues('licence'),
      Volumetrie_en_Mo_: document.getElementById('volumetrie').value,
      Donnees_ouvertes: document.getElementById('donnees-ouvertes').checked,
      URL_Open_Data: document.getElementById('url-open-data').value,

      // Niveau 6 - Qualification
      Statut_Qualification: getSelectValues('statut-qualification'),
    };
  }

  // === Initialisation ===

  // Mode Express activé par défaut
  setExpressMode(true);

  // Calcul initial
  calculateScore();
  calculateBadge();

})();
