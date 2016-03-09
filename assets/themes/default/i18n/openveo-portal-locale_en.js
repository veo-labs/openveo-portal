'use strict';

angular.module('ov.locale', [], ['$provide', function($provide) {
  $provide.value('translations', {
    UI: {
      LOGIN: 'Log in',
      LOGOUT: 'Log out',
      HELLO: 'Hi',
      SEARCH: 'Search',
      CANCEL: 'Cancel',
      VIEWS: 'views',
      DATE: 'date',
      SHARE: 'Share',
      DATE_BETWEEN: 'Date between',
      AND: 'and',
      CLOSE: 'Close'
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
      NO_RESULTS: 'No results found',
      ADVANCED: 'Advanced search',
      ORDER_BY: 'Order by : ',
      NAME: 'Speaker',
      CATEGORY: 'Categorie',
      ORIGIN: 'Origin',
      TITLE: 'Title'
    },
    MENU: {
      HOME: 'HOME',
      ALL_VIDEOS: 'All videos'
    },
    LINKS: {
      CONTACT: 'Contact',
      HELP: 'Help'
    },
    ERROR: {
      CLIENT: 'An application error occured, please contact the administrator.',
      SERVER: 'A server error occured, please contact the administrator.',
      FORBIDDEN: 'You don\'t have permission for this action.'
    }
  });
}]);
