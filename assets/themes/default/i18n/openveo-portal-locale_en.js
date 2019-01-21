'use strict';

angular.module('ov.locale', [], ['$provide', function($provide) {
  $provide.value('translations', {
    UI: {
      LOGIN: 'Log in',
      LOGOUT: 'Log out',
      SEARCH: 'Search',
      CANCEL: 'Cancel',
      VIEW: {
        SINGLE: 'view',
        PLURAL: 'views'
      },
      DATE: 'date',
      SHARE: 'Share',
      DATE_BETWEEN: 'Date between',
      AND: 'and',
      CLOSE: 'Close',
      LINK: 'Link',
      CODE: 'HTML Code',
      TITLE: 'Title',
      ARIA_USER_MENU: 'Open user menu',
      BACK_OFFICE: 'Administration',
      LESS: 'Less',
      MORE: 'Plus'
    },
    HOME: {
      PAGE_TITLE: 'Portal - Home',
      TITLE: 'Latest videos',
      ALL_VIDEOS: 'See all videos'
    },
    VIDEO: {
      PAGE_TITLE: 'Portal - Video'
    },
    SEARCH: {
      PAGE_TITLE: 'Portal - Search',
      TITLE: 'All videos',
      KEYWORD: 'Search by keyword',
      RESULT: {
        SINGLE: 'Result',
        PLURAL: 'Results'
      },
      NO_RESULTS: 'No results found',
      ADVANCED: 'Advanced search',
      ORDER_BY: 'Order by : ',
      FILTER_BY: 'Filter by : ',
      NAME_FILTER: 'Speaker',
      CATEGORY_FILTER: 'Category',
      ORIGIN_FILTER: 'Origin',
      DATE_OR_VIEWS: 'Date or views',
      ORDER_ASC: 'Ascending or descending',
      NO_FILTER: 'None'
    },
    LIVE: {
      PAGE_TITLE: 'Portal - Live',
      TITLE: 'Live'
    },
    LOGIN: {
      PAGE_TITLE: 'Portal - Login',
      TITLE: 'Login',
      CONNECT_WITH: 'Connect with',
      CONNECT_OR: 'or',
      CAS: 'CAS',
      SUBMIT: 'Submit',
      LOGIN_FIELD: 'Login',
      PASSWORD_FIELD: 'Password',
      ERROR: 'Login and / or password incorrect'
    },
    MENU: {
      HOME: 'Home',
      ALL_VIDEOS: 'All videos',
      LIVE: 'Live',
      ARIA_DESCRIPTION: 'Navigation links'
    },
    LINKS: {
      CONTACT: 'Contact',
      HELP: 'Help',
      ARIA_DESCRIPTION: 'Information links'
    },
    ERROR: {
      CLIENT: 'An application error occured, please contact the administrator.',
      SERVER: 'A server error occured, please contact the administrator.',
      FORBIDDEN: 'You don\'t have permission for this action.'
    }
  });
}]);
