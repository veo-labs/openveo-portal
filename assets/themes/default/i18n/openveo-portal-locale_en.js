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
      CLOSE: 'Close',
      LINK: 'Link',
      CODE: 'HTML Code',
      TITLE: 'Title'
    },
    HOME: {
      PAGE_TITLE: 'Portal - Home',
      TITLE: 'Last videos',
      ALL_VIDEOS: 'See all videos'
    },
    VIDEOS: {
      PAGE_TITLE: 'Portal - Video'
    },
    SEARCH: {
      PAGE_TITLE: 'Portal - Videos',
      TITLE: 'Last videos',
      KEYWORD: 'Search by keyword',
      RESULTS: 'Results',
      RESULT: 'Result',
      NO_RESULTS: 'No results found',
      ADVANCED: 'Advanced search',
      ORDER_BY: 'Order by : ',
      NAME_FILTER: 'Speaker',
      CATEGORY_FILTER: 'Categorie',
      ORIGIN_FILTER: 'Origin',
      DATE_OR_VIEWS: 'Date or views',
      ORDER_ASC: 'Ascending or descending'
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
