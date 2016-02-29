'use strict';

angular.module('ov.locale', [], ['$provide', function($provide) {
  $provide.value('translations', {
    HOME: {
      PAGE_TITLE: 'Portail - Accueil'
    },
    LINKS : {
      CONTACT: 'Contact',
      HELP: 'Aide'
    },
    ERROR : {
      CLIENT : 'Une erreur applicative est survenue, veuillez contacter l\'administrateur.',
      SERVER : 'Une erreur serveur est survenue, veuillez contacter l\'administrateur.',
      FORBIDDEN : 'Vous n\'avez pas la permission d\'effectuer cette action.'
    }
  });
}]);
