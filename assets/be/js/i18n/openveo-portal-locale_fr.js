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
        UP_TO_DATE_TOOLTIP: 'OpenVeo Portal est à jour',
        UP_TO_DATE_DESCRIPTION: 'Vous utilisez la dernière version (<a href="%versionUrl%" target="_blank" title="Version actuelle">%version%</a>).<br/>Aucune mise à jour disponible.',
        NEED_UPGRADE: 'Une nouvelle version d\'OpenVeo Portal est disponible',
        NEED_UPGRADE_DESCRIPTION: 'Vous utilisez la version <a href="%versionUrl%" target="_blank" title="Version actuelle">%version%</a> d\'OpenVeo Portal. La version <a href="%latestVersionUrl%" target="_blank" title="Dernière version">%latestVersion%</a> est maintenant disponible.<br/><br/>Merci d\'en informer l\'administrateur.',
        VIEW_SOURCE: 'Voir les sources',
        ERROR: 'Information non disponible',
        INFO: '"<strong>A propos</strong>" vous donne des informations concernant la version d\'OpenVeo Portal que vous utilisez. Il vous prévient lorsqu\'une nouvelle version est disponible et vous indique ou se trouve le code source.',
        SHOW_INFO: "Afficher plus d'information",
        SHOW_INFO_TOOLTIP: "Afficher plus d'information sur le bloc \"à propos\""
      }
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
      CLOSE: 'Ok !'
    }
  });
}]);
