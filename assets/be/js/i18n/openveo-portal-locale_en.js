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
      SETTINGS: 'Settings',
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
        INFO_BUTTON_TOOLTIP: 'Show "about" information',
        ERROR: 'Information not available',
        INFO: '"<strong>About</strong>" gives you information regarding your version of OpenVeo Portal. It informs you when a new version is available and where you can find the sources.'
      }
    },
    SETTINGS: {
      PAGE_TITLE: 'OpenVeo Portal - Settings',
      TITLE: 'Settings',
      LIVE: {
        TITLE: 'Live',
        INFO_BUTTON_DESCRIPTION: 'Show more information about live configuration',
        INFO_BUTTON_TOOLTIP: 'Show more information about live configuration',
        INFO: '<strong>Live</strong> can be deactivated, if so live page is not accessible.<br/><br/><strong>Private</strong> indicates that the live is accessible only for a list of OpenVeo groups.',
        ACTIVATED_LABEL: 'Live activated',
        DEACTIVATED_LABEL: 'Live deactivated',
        ACTIVATED_DESCRIPTION: 'Activate / deactivate live page',
        PLAYER_TYPE_LABEL: 'Player',
        URL_LABEL: 'URL',
        URL_EMPTY_ERROR: 'Error: you must specify a live stream URL',
        URL_YOUTUBE_ERROR: 'Error: Invalid Youtube live stream URL (e.g. https://www.youtube.com/watch?v=123456)',
        URL_WOWZA_ERROR: 'Error: Invalid Wowza live stream URL (e.g. https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8)',
        PRIVATE_LABEL: 'Private',
        PRIVATE_DESCRIPTION: 'Restrict access to the live',
        GROUPS_LABEL: 'OpenVeo groups',
        GROUPS_EMPTY_ERROR: 'Error: you must add at least one group for a private live',
        PLAYER_LICENSE_LABEL: 'Player license',
        PLAYER_LICENSE_EMPTY_ERROR: 'Error: you must specify a Wowza player license key (available on https://player.wowza.com)',
        PLAYER_LICENSE_ERROR: 'Error: Invalid Wowza player license key (e.g. xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx)',
        WOWZA: 'Wowza',
        YOUTUBE: 'Youtube'
      },
      SUBMIT_BUTTON: 'Save',
      SAVE_SUCCESS: 'Settings saved',
      ERROR_MESSAGE: 'Can\'t load settings'
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
      CLOSE: 'Got it!'
    }
  });
}]);
