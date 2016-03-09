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
      CLOSE: 'Fermer'
    },
    HOME: {
      PAGE_TITLE: 'Portail - Accueil',
      TITLE: 'Les vidéos du moment',
      ALL_VIDEOS: 'Voir toutes les vidéos'
    },
    VIDEOS: {
      PAGE_TITLE: 'Portail - Vidéos',
      TITLE: 'Toutes les vidéos'
    },
    SEARCH: {
      KEYWORD: 'Rechercher par mot clé',
      RESULTS: 'Résultats',
      RESULT: 'Résultat',
      NO_RESULTS: 'Aucun résultat correspondant à la recherche',
      ADVANCED: 'Recherche avancée',
      ORDER_BY: 'Trier par : ',
      NAME: 'Intervenant',
      CATEGORY: 'Rubrique',
      ORIGIN: 'Origine',
      TITLE: 'Titre'
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
