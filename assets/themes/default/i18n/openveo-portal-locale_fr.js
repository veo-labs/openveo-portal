'use strict';

angular.module('ov.locale', [], ['$provide', function($provide) {
  $provide.value('translations', {
    UI: {
      LOGIN: 'Connexion',
      LOGOUT: 'Déconnexion',
      SEARCH: 'Rechercher',
      CANCEL: 'Annuler',
      VIEW: {
        SINGLE: 'vue',
        PLURAL: 'vues'
      },
      DATE: 'date',
      SHARE: 'Partager',
      DATE_BETWEEN: 'Date entre le',
      AND: 'et le',
      CLOSE: 'Fermer',
      LINK: 'Lien',
      CODE: 'Code HTML',
      TITLE: 'Titre',
      ARIA_USER_MENU: 'Ouvrir le menu utilisateur',
      BACK_OFFICE: 'Administration'
    },
    HOME: {
      PAGE_TITLE: 'Portail - Accueil',
      TITLE: 'Les vidéos du moment',
      ALL_VIDEOS: 'Voir toutes les vidéos'
    },
    VIDEO: {
      PAGE_TITLE: 'Portail - Vidéo'
    },
    SEARCH: {
      PAGE_TITLE: 'Portail - Recherche',
      TITLE: 'Toutes les vidéos',
      KEYWORD: 'Rechercher par mot clé',
      RESULT: {
        SINGLE: 'Résultat',
        PLURAL: 'Résultats'
      },
      NO_RESULTS: 'Aucun résultat correspondant à la recherche',
      ADVANCED: 'Recherche avancée',
      ORDER_BY: 'Trier par : ',
      FILTER_BY: 'Filtrer par :',
      NAME_FILTER: 'Intervenant',
      CATEGORY_FILTER: 'Rubrique',
      ORIGIN_FILTER: 'Origine',
      DATE_OR_VIEWS: 'Date ou nombre de vues',
      ORDER_ASC: 'Croissant ou décroissant',
      NO_FILTER: 'Aucun'
    },
    LOGIN: {
      PAGE_TITLE: 'Portail - Connexion',
      TITLE: 'Connexion',
      CONNECT_WITH: 'Connectez-vous avec',
      CONNECT_OR: 'ou',
      CAS: 'CAS',
      SUBMIT: 'Connexion',
      LOGIN_FIELD: 'Identifiant',
      PASSWORD_FIELD: 'Mot de passe',
      ERROR: 'Identifiant et / ou mot de passe incorrect'
    },
    MENU: {
      HOME: 'Accueil',
      ALL_VIDEOS: 'Toutes les vidéos',
      ARIA_DESCRIPTION: 'Liens de navigation'
    },
    LINKS: {
      CONTACT: 'Contact',
      HELP: 'Aide',
      ARIA_DESCRIPTION: 'Liens d\'information'
    },
    ERROR: {
      CLIENT: 'Une erreur applicative est survenue, veuillez contacter l\'administrateur.',
      SERVER: 'Une erreur serveur est survenue, veuillez contacter l\'administrateur.',
      FORBIDDEN: 'Vous n\'avez pas la permission d\'effectuer cette action.'
    }
  });
}]);
