'use strict';

angular.module('opa.locale', [], ['$provide', function($provide) {
  $provide.value('opaTranslations', {
    HEADER: {
      TITLE: 'Administration',
      TOGGLE_MENU_BUTTON: 'Show/hide navigation menu',
      TOGGLE_MENU_TOOLTIP: 'Show/hide menu',
      VIEW_PORTAL_BUTTON: 'Display the portal',
      VIEW_PORTAL_TOOLTIP: 'Display portal',
      TOGGLE_LANGUAGES_BUTTON: 'Show/hide languages menu',
      TOGGLE_LANGUAGES_TOOLTIP: 'Change language',
      TOGGLE_USER_ACTIONS_BUTTON: 'Show/hide user actions',
      TOGGLE_USER_ACTIONS_TOOLTIP: 'Show user menu',
      USER_ACTIONS: {
        DISCONNECT: 'Disconnect'
      },
      LANGUAGES: {
        EN: 'English',
        FR: 'French'
      }
    },
    NAV: {
      DASHBOARD: 'Dashboard',
      VIEW_PORTAL: 'Display the portal',
      LANGUAGE: 'Select language',
      LANGUAGES: {
        EN: 'English',
        FR: 'French'
      },
      LOGOUT: 'Disconnect'
    },
    DASHBOARD: {
      PAGE_TITLE: 'OpenVeo Portal - Dashboard',
      TITLE: 'Dashboard',
      ABOUT: {
        TITLE: 'About',
        UP_TO_DATE: 'OpenVeo Portal is up to date',
        UP_TO_DATE_DESCRIPTION: 'You are using the latest version (<a href="%versionUrl%" target="_blank" title="Actual version">%version%</a>).<br/>No updates available.',
        NEED_UPGRADE: 'A new version of OpenVeo Portal is available',
        NEED_UPGRADE_DESCRIPTION: 'You are using OpenVeo Portal <a href="%versionUrl%" target="_blank" title="Actual version">%version%</a>.<br/>Version <a href="%latestVersionUrl%" target="_blank" title="Latest version">%latestVersion%</a> is now available.<br/><br/>Please notify the administrator.',
        VIEW_SOURCE: 'View sources',
        INFO_BUTTON_DESCRIPTION: 'Show "about" information',
        ERROR: 'Information not available',
        INFO: '"<strong>About</strong>" gives you information regarding your version of OpenVeo Portal. It informs you when a new version is available and where you can find the sources.'
      }
    },
    ERRORS: {
      CLIENT: 'An application error occured, please contact the administrator',
      SERVER: 'A server error occured, please contact the administrator',
      FORBIDDEN: 'You don\'t have permission for this action'
    },
    NOTIFICATION: {
      CLOSE: 'Close'
    },
    INFO: {
      CLOSE: 'Got it!',
      INFO_BUTTON_DESCRIPTION: 'More information'
    }
  });
}]);
