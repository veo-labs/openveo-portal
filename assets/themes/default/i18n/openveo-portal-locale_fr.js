'use strict';

angular.module('ov.locale', [], ['$provide', function($provide) {
  $provide.value('translations', {
    UI: {
      LOGIN: 'Connexion',
      LOGOUT: 'Déconnexion',
      HELLO: 'Bonjour',
      SEARCH: 'Rechercher',
      CANCEL: 'Annuler',
      VIEWS: 'vues',
      DATE: 'date',
      SHARE: 'Partager',
      DATE_BETWEEN: 'Date entre',
      AND: 'et',
      CLOSE: 'Fermer',
      LINK: 'Lien',
      CODE: 'Code HTML',
      TITLE: 'Titre'
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
      RESULTS: 'Résultats',
      RESULT: 'Résultat',
      NO_RESULTS: 'Aucun résultat correspondant à la recherche',
      ADVANCED: 'Recherche avancée',
      ORDER_BY: 'Trier par : ',
      NAME_FILTER: 'Intervenant',
      CATEGORY_FILTER: 'Rubrique',
      ORIGIN_FILTER: 'Origine',
      DATE_OR_VIEWS: 'Date ou nombre de vues',
      ORDER_ASC: 'Croissant ou décroissant'
    },
    MENU: {
      HOME: 'Accueil',
      ALL_VIDEOS: 'Toutes les vidéos'
    },
    LINKS: {
      CONTACT: 'Contact',
      HELP: 'Aide'
    },
    ERROR: {
      CLIENT: 'Une erreur applicative est survenue, veuillez contacter l\'administrateur.',
      SERVER: 'Une erreur serveur est survenue, veuillez contacter l\'administrateur.',
      FORBIDDEN: 'Vous n\'avez pas la permission d\'effectuer cette action.'
    }
  });
}]);
