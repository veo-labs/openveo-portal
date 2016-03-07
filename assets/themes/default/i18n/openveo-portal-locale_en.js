'use strict';

angular.module('ov.locale', [], ['$provide', function($provide) {
  $provide.value('translations', {
    UI: {
      CONNECTION: 'Connection',
      SEARCH: 'Search',
      CANCEL: 'Cancel',
      VIEWS: 'views',
      DATE: 'date'
    },
    HOME: {
      PAGE_TITLE: 'Portal - Home',
      TITLE: 'Last videos',
      ALL_VIDEOS: 'See all videos'
    },
    VIDEOS: {
      PAGE_TITLE: 'Portal - Videos',
      TITLE: 'Last videos'
    },
    SEARCH: {
      KEYWORD: 'Search by keyword',
      RESULTS: 'Results',
      RESULT: 'Result',
      ADVANCED: 'Advanced search',
      ORDER_BY: 'Order by : '
    },
    MENU: {
      HOME: 'HOME',
      ALL_VIDEOS: 'All videos'
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
