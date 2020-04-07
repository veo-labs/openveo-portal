'use strict';

angular.module('opa.locale', [], ['$provide', function($provide) {
  $provide.value('opaTranslations', {
    HEADER: {
      TITLE: 'Administration',
      TOGGLE_MENU_ACCESSIBILITY: 'Show/hide navigation menu',
      TOGGLE_MENU_TOOLTIP: 'Show/hide menu',
      VIEW_PORTAL_ACCESSIBILITY: 'Display the portal',
      VIEW_PORTAL_TOOLTIP: 'Display portal',
      TOGGLE_LANGUAGES_ACCESSIBILITY: 'Show/hide languages menu',
      TOGGLE_LANGUAGES_TOOLTIP: 'Change language',
      TOGGLE_USER_ACTIONS_ACCESSIBILITY: 'Show/hide user actions',
      TOGGLE_USER_ACTIONS_TOOLTIP: 'Show user menu',
      INFO_ACCESSIBILITY: 'Show information about current page',
      INFO_TOOLTIP: 'Show page info',
      USER_ACTIONS: {
        DISCONNECT: 'Disconnect',
        DISCONNECT_ACCESSIBILITY: 'Disconnect from back office'
      },
      LANGUAGES: {
        EN: 'English',
        EN_ACCESSIBILITY: 'Display back office in english',
        FR: 'French',
        FR_ACCESSIBILITY: 'Display back office in french',
      }
    },
    NAV: {
      DASHBOARD: 'Dashboard',
      PROMOTED_VIDEOS: 'Promoted videos',
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
      INFO: 'The <strong>Dashboard</strong> page gives you a quick overview of your OpenVeo Portal.',
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
    PROMOTED_VIDEOS: {
      PAGE_TITLE: 'OpenVeo Portal - Promoted videos',
      TITLE: 'Promoted videos',
      INFO: 'The <strong>Promoted videos</strong> page gives you the possibility to choose your promoted videos.',
      ERROR_MESSAGE: 'Can\'t load promoted videos',
      SAVE_SUCCESS: 'Promoted videos saved',
      SUBMIT_BUTTON: 'Save'
    },
    SETTINGS: {
      PAGE_TITLE: 'OpenVeo Portal - Settings',
      TITLE: 'Settings',
      INFO: 'The <strong>Settings</strong> page let\'s you configure how your OpenVeo Portal must behave in general.',
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
        URL_VODALYS_ERROR: 'Error: Invalid Vodalys Studio live stream URL (e.g. https://console.vodalys.studio/vpage2/0hjertPpReB2Dbmr)',
        PRIVATE_LABEL: 'Private',
        PRIVATE_DESCRIPTION: 'Restrict access to the live',
        GROUPS_LABEL: 'OpenVeo groups',
        GROUPS_EMPTY_ERROR: 'Error: you must add at least one group for a private live',
        PLAYER_LICENSE_LABEL: 'Player license',
        PLAYER_LICENSE_EMPTY_ERROR: 'Error: you must specify a Wowza player license key (available on https://player.wowza.com)',
        PLAYER_LICENSE_ERROR: 'Error: Invalid Wowza player license key (e.g. xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx)',
        WOWZA: 'Wowza',
        YOUTUBE: 'Youtube',
        VODALYS: 'Vodalys'
      },
      SEARCH: {
        TITLE: 'Search',
        INFO_BUTTON_DESCRIPTION: 'Show more information about search configuration',
        INFO_BUTTON_TOOLTIP: 'Show more information about search configuration',
        INFO: '<strong>Search</strong> in portal default behaviour can be customized from here.',
        POIS_LABEL: 'Search in tags and chapters by default',
        POIS_DESCRIPTION: 'Search in titles and descriptions of tags and chapters by default'
      },
      SUBMIT_BUTTON: 'Save',
      SAVE_SUCCESS: 'Settings saved',
      ERROR_MESSAGE: 'Can\'t load settings'
    },
    MEDIA_CONTAINER: {
      REMOVE: 'Remove'
    },
    MEDIA_LIBRARY: {
      FILTER_TOOLBAR: {
        NAME: 'Search'
      }
    },
    MEDIA_LIBRARY_DIALOG: {
      TITLE: 'Media library',
      CLOSE: 'Fermer',
      VALIDATE: 'Validate'
    },
    ERRORS: {
      CLIENT: 'An application error occured, please contact the administrator',
      SERVER: 'A server error occured, please contact the administrator',
      FORBIDDEN: 'You don\'t have permission for this action'
    },
    NOTIFICATION: {
      CLOSE: 'Close',
      CLOSE_ACCESSIBILITY: 'Close'
    },
    INFO: {
      CLOSE: 'Got it!',
      CLOSE_ACCESSIBILITY: 'Got it!'
    }
  });
}]);
