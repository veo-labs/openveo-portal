'use strict';

angular.module('opa.locale', [], ['$provide', function($provide) {
  $provide.value('opaTranslations', {
    HEADER: {
      TITLE: 'Administration',
      TOGGLE_MENU_BUTTON: 'Afficher/masquer le menu de navigation',
      TOGGLE_MENU_TOOLTIP: 'Afficher/masquer le menu',
      VIEW_PORTAL_BUTTON: 'Afficher le portail',
      VIEW_PORTAL_TOOLTIP: 'Afficher le portail',
      TOGGLE_LANGUAGES_BUTTON: 'Afficher/masquer le menu des langues',
      TOGGLE_LANGUAGES_TOOLTIP: 'Changer de langue',
      TOGGLE_USER_ACTIONS_BUTTON: 'Afficher/masquer les actions utilisateur',
      TOGGLE_USER_ACTIONS_TOOLTIP: 'Afficher le menu utilisateur',
      USER_ACTIONS: {
        DISCONNECT: 'Déconnexion'
      },
      LANGUAGES: {
        EN: 'Anglais',
        FR: 'Français'
      }
    },
    NAV: {
      DASHBOARD: 'Tableau de bord',
      SETTINGS: 'Configuration',
      VIEW_PORTAL: 'Afficher le portail',
      LANGUAGE: 'Choisir la language',
      LANGUAGES: {
        EN: 'English',
        FR: 'French'
      },
      LOGOUT: 'Déconnexion'
    },
    DASHBOARD: {
      PAGE_TITLE: 'OpenVeo Portal - Tableau de bord',
      TITLE: 'Tableau de bord',
      ABOUT: {
        TITLE: 'A propos',
        UP_TO_DATE: 'OpenVeo Portal est à jour',
        UP_TO_DATE_DESCRIPTION: 'Vous utilisez la dernière version (<a href="%versionUrl%" target="_blank" title="Version actuelle">%version%</a>).<br/>Aucune mise à jour disponible.',
        NEED_UPGRADE: 'Une nouvelle version d\'OpenVeo Portal est disponible',
        NEED_UPGRADE_DESCRIPTION: 'Vous utilisez la version <a href="%versionUrl%" target="_blank" title="Version actuelle">%version%</a> d\'OpenVeo Portal. La version <a href="%latestVersionUrl%" target="_blank" title="Dernière version">%latestVersion%</a> est maintenant disponible.<br/><br/>Merci d\'en informer l\'administrateur.',
        VIEW_SOURCE: 'Voir les sources',
        INFO_BUTTON_DESCRIPTION: 'Afficher plus d\'informations sur "à propos"',
        ERROR: 'Information non disponible',
        INFO: '"<strong>A propos</strong>" vous donne des informations concernant la version d\'OpenVeo Portal que vous utilisez. Il vous prévient lorsqu\'une nouvelle version est disponible et vous indique ou se trouve le code source.'
      }
    },
    SETTINGS: {
      PAGE_TITLE: 'OpenVeo Portal - Configuration',
      TITLE: 'Configuration',
      LIVE: {
        TITLE: 'Live',
        INFO_BUTTON_DESCRIPTION: 'Afficher plus d\'informations sur la configuration du live',
        INFO: '<strong>Live</strong> peut-être désactivé, la page live est alors inaccessible.<br/><br/><strong>Privé</strong> indique que le live n\'est accessible que pour une liste de groupes OpenVeo.',
        ACTIVATED_LABEL: 'Live activée',
        DEACTIVATED_LABEL: 'Live désactivé',
        ACTIVATED_DESCRIPTION: 'Activer / désactiver la page live',
        PLAYER_TYPE_LABEL: 'Player',
        URL_LABEL: 'URL',
        URL_EMPTY_ERROR: 'Erreur : vous devez préciser une URL de streaming live',
        URL_YOUTUBE_ERROR: 'Erreur : URL Youtube de streaming live invalide (ex : https://www.youtube.com/watch?v=123456)',
        URL_WOWZA_ERROR: 'Erreur : URL Wowza de streaming live invalide (ex : https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8)',
        PRIVATE_LABEL: 'Privé',
        PRIVATE_DESCRIPTION: 'Restreindre l\'accès au live',
        GROUPS_LABEL: 'Groupes OpenVeo',
        GROUPS_EMPTY_ERROR: 'Erreur : vous devez ajouter au moins un groupe pour un live privé',
        PLAYER_LICENSE_LABEL: 'Licence du player',
        PLAYER_LICENSE_EMPTY_ERROR: 'Erreur : vous devez préciser le numéro de licence du player Wowza (disponible sur https://player.wowza.com)',
        PLAYER_LICENSE_ERROR: 'Erreur : numéro de license invalide (ex : xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx)',
        WOWZA: 'Wowza',
        YOUTUBE: 'Youtube'
      },
      SUBMIT_BUTTON: 'Enregistrer',
      SAVE_SUCCESS: 'Configuration enregistrée',
      ERROR_MESSAGE: 'Impossible d\'afficher la configuration'
    },
    ERRORS: {
      CLIENT: 'Une erreur applicative est survenue, veuillez contacter l\'administrateur',
      SERVER: 'Une erreur serveur est survenue, veuillez contacter l\'administrateur',
      FORBIDDEN: 'Vous n\'avez pas la permission d\'effectuer cette action'
    },
    NOTIFICATION: {
      CLOSE: 'Fermer'
    },
    INFO: {
      CLOSE: 'Ok !',
      INFO_BUTTON_DESCRIPTION: 'Plus d\'informations'
    }
  });
}]);
