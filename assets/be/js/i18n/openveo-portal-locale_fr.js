'use strict';

angular.module('opa.locale', [], ['$provide', function($provide) {
  $provide.value('opaTranslations', {
    HEADER: {
      TITLE: 'Administration',
      TOGGLE_MENU_ACCESSIBILITY: 'Afficher/masquer le menu de navigation',
      TOGGLE_MENU_TOOLTIP: 'Afficher/masquer le menu',
      VIEW_PORTAL_ACCESSIBILITY: 'Afficher le portail',
      VIEW_PORTAL_TOOLTIP: 'Afficher le portail',
      TOGGLE_LANGUAGES_ACCESSIBILITY: 'Afficher/masquer le menu des langues',
      TOGGLE_LANGUAGES_TOOLTIP: 'Changer de langue',
      TOGGLE_USER_ACTIONS_ACCESSIBILITY: 'Afficher/masquer les actions utilisateur',
      TOGGLE_USER_ACTIONS_TOOLTIP: 'Afficher le menu utilisateur',
      INFO_ACCESSIBILITY: 'Afficher plus d\'information sur la page courante',
      INFO_TOOLTIP: 'Afficher plus d\'information',
      USER_ACTIONS: {
        DISCONNECT: 'Déconnexion',
        DISCONNECT_ACCESSIBILITY: 'Se déconnecter de l\'interface d\'administration'
      },
      LANGUAGES: {
        EN: 'Anglais',
        EN_ACCESSIBILITY: 'Afficher l\'interface d\'administration en anglais',
        FR: 'Français',
        FR_ACCESSIBILITY: 'Afficher l\'interface d\'administration en français'
      }
    },
    NAV: {
      DASHBOARD: 'Tableau de bord',
      SETTINGS: 'Configuration',
      PROMOTED_VIDEOS: 'Vidéos à la une',
      VIEW_PORTAL: 'Afficher le portail',
      LANGUAGE: 'Choisir la langue',
      LANGUAGES: {
        EN: 'Anglais',
        FR: 'Français'
      },
      LOGOUT: 'Déconnexion'
    },
    DASHBOARD: {
      PAGE_TITLE: 'OpenVeo Portal - Tableau de bord',
      TITLE: 'Tableau de bord',
      INFO: 'Le <strong>Tableau de bord</strong> vous donne un aperçu rapide de votre Portail OpenVeo.',
      ABOUT: {
        TITLE: 'A propos',
        UP_TO_DATE: 'OpenVeo Portal est à jour',
        UP_TO_DATE_DESCRIPTION: 'Vous utilisez la dernière version (<a href="%versionUrl%" target="_blank" title="Version actuelle">%version%</a>).<br/>Aucune mise à jour disponible.',
        NEED_UPGRADE: 'Une nouvelle version d\'OpenVeo Portal est disponible',
        NEED_UPGRADE_DESCRIPTION: 'Vous utilisez la version <a href="%versionUrl%" target="_blank" title="Version actuelle">%version%</a> d\'OpenVeo Portal. La version <a href="%latestVersionUrl%" target="_blank" title="Dernière version">%latestVersion%</a> est maintenant disponible.<br/><br/>Merci d\'en informer l\'administrateur.',
        VIEW_SOURCE: 'Voir les sources',
        INFO_BUTTON_DESCRIPTION: 'Afficher plus d\'informations sur "à propos"',
        INFO_BUTTON_TOOLTIP: 'Afficher plus d\'informations sur "à propos"',
        ERROR: 'Information non disponible',
        INFO: '"<strong>A propos</strong>" vous donne des informations concernant la version d\'OpenVeo Portal que vous utilisez. Il vous prévient lorsqu\'une nouvelle version est disponible et vous indique ou se trouve le code source.'
      }
    },
    PROMOTED_VIDEOS: {
      PAGE_TITLE: 'OpenVeo Portal - Vidéos à la une',
      TITLE: 'Vidéos à la une',
      INFO: 'La page <strong>Vidéos à la une</strong> vous permet de choisir les vidéos à la une.',
      ERROR_MESSAGE: 'Impossible d\'afficher les vidéos à la une',
      SAVE_SUCCESS: 'Vidéos à la une enregistrées',
      SUBMIT_BUTTON: 'Enregistrer'
    },
    SETTINGS: {
      PAGE_TITLE: 'OpenVeo Portal - Configuration',
      TITLE: 'Configuration',
      INFO: 'La page <strong>Configuration</strong> vous permet de configurer le comportement général de votre Portail OpenVeo.',
      LIVE: {
        TITLE: 'Live',
        INFO_BUTTON_DESCRIPTION: 'Afficher plus d\'informations sur la configuration du live',
        INFO_BUTTON_TOOLTIP: 'Afficher plus d\'informations sur la configuration du live',
        INFO: '<strong>Live</strong> peut-être désactivé, la page live est alors inaccessible.<br/><br/><strong>Privé</strong> indique que le live n\'est accessible que pour une liste de groupes OpenVeo.',
        ACTIVATED_LABEL: 'Live activée',
        DEACTIVATED_LABEL: 'Live désactivé',
        ACTIVATED_DESCRIPTION: 'Activer / désactiver la page live',
        PLAYER_TYPE_LABEL: 'Player',
        URL_LABEL: 'URL',
        URL_EMPTY_ERROR: 'Erreur : vous devez préciser une URL de streaming live',
        URL_YOUTUBE_ERROR: 'Erreur : URL Youtube de streaming live invalide (ex : https://www.youtube.com/watch?v=123456)',
        URL_WOWZA_ERROR: 'Erreur : URL Wowza de streaming live invalide (ex : https://wowza-example.local:1935/application-example/stream-example/playlist.m3u8)',
        URL_VIMEO_ERROR: 'Erreur : URL Vimeo de streaming live invalide (ex : https://vimeo.com/event/428806)',
        URL_VODALYS_ERROR: 'Erreur : URL Vodalys Studio de streaming live invalide (ex : https://console.vodalys.studio/vpage2/0hjertPpReB2Dbmr)',
        PRIVATE_LABEL: 'Privé',
        PRIVATE_DESCRIPTION: 'Restreindre l\'accès au live',
        GROUPS_LABEL: 'Groupes OpenVeo',
        GROUPS_EMPTY_ERROR: 'Erreur : vous devez ajouter au moins un groupe pour un live privé',
        WOWZA: 'Wowza',
        YOUTUBE: 'Youtube',
        VIMEO: 'Vimeo',
        VODALYS: 'Vodalys'
      },
      SEARCH: {
        TITLE: 'Recherche',
        INFO_BUTTON_DESCRIPTION: 'Afficher plus d\'informations sur la configuration du moteur de recherche',
        INFO_BUTTON_TOOLTIP: 'Afficher plus d\'informations sur la configuration du moteur de recherche',
        INFO: '"<strong>Recherche</strong>" vous permet de paramétrer le moteur de recherche',
        POIS_LABEL: 'Rechercher dans les chapitres et tags par défaut',
        POIS_DESCRIPTION: 'Rechercher dans les titres et descriptions des chapitres et tags par défaut'
      },
      SUBMIT_BUTTON: 'Enregistrer',
      SAVE_SUCCESS: 'Configuration enregistrée',
      ERROR_MESSAGE: 'Impossible d\'afficher la configuration'
    },
    MEDIA_CONTAINER: {
      REMOVE: 'Supprimer'
    },
    MEDIA_LIBRARY: {
      FILTER_TOOLBAR: {
        NAME: 'Rechercher'
      }
    },
    MEDIA_LIBRARY_DIALOG: {
      TITLE: 'Bibliothèque de média',
      CLOSE: 'Fermer',
      VALIDATE: 'Valider'
    },
    ERRORS: {
      CLIENT: 'Une erreur applicative est survenue, veuillez contacter l\'administrateur',
      SERVER: 'Une erreur serveur est survenue, veuillez contacter l\'administrateur',
      FORBIDDEN: 'Vous n\'avez pas la permission d\'effectuer cette action'
    },
    NOTIFICATION: {
      CLOSE: 'Fermer',
      CLOSE_ACCESSIBILITY: 'Fermer'
    },
    INFO: {
      CLOSE: 'Ok !',
      CLOSE_ACCESSIBILITY: 'Ok !'
    }
  });
}]);
