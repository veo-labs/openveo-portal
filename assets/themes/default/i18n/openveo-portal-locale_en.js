'use strict';

angular.module('ov.locale', [], ['$provide', function($provide) {
  $provide.value('translations', {
    HOME: {
      PAGE_TITLE: 'Portal - home'
    },
    LINKS : {
      CONTACT: 'Contact',
      HELP: 'Help'
    },
    ERROR : {
      CLIENT : 'An application error occured, please contact the administrator.',
      SERVER : 'A server error occured, please contact the administrator.',
      FORBIDDEN : 'You don\'t have permission for this action.'
    }
  });
}]);
