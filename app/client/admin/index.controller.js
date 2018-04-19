'use strict';

/**
 * @module opa
 */

(function(app) {

  /**
   * Defines the main controller of the OpenVeo Portal administration interface.
   *
   * @class OpaIndexController
   * @constructor
   * @param {Object} $scope AngularJS scope
   * @param {Object} $route AngularJS $route service
   * @param {Object} $window AngularJS $window service
   * @param {Object} $location AngularJS $location service
   * @param {Object} $filter AngularJS $filter service
   * @param {Object} $mdMedia AngularJS Material service to evaluate media queries
   * @param {Object} $mdSidenav AngularJS Material service to manipulate sidenav directives
   * @param {Object} opaUserFactory User factory to deal with the authenticated user
   * @param {Object} opaI18nFactory I18n factory to manage languages
   * @param {Object} opaNotificationFactory Notification factory
   */
  function OpaIndexController(
    $scope,
    $route,
    $window,
    $location,
    $filter,
    $mdMedia,
    $mdSidenav,
    opaUserFactory,
    opaI18nFactory,
    opaNotificationFactory
  ) {
    var ctrl = this;
    var translateFilter = $filter('opaTranslate');

    Object.defineProperties(ctrl, {

      /**
       * Information about the page.
       *
       * @property page
       * @type Object
       * @final
       */
      page: {
        value: {}
      },

      /**
       * Title of the administration interface as a translation id.
       *
       * @property adminTitle
       * @type Object
       * @final
       */
      adminTitle: {
        value: 'HEADER.TITLE'
      },

      /**
       * AngularJS Material $mdMedia service.
       *
       * @property $mdMedia
       * @type Object
       * @final
       */
      $mdMedia: {
        value: $mdMedia
      },

      /**
       * Menu links.
       *
       * @property menuLinks
       * @type Array
       * @final
       */
      menuLinks: {
        value: []
      },

      /**
       * The list of left actions for the toolbar.
       *
       * @property toolbarLeftActions
       * @type Array
       * @final
       */
      toolbarLeftActions: {
        value: []
      },

      /**
       * The list of right actions for the toolbar.
       *
       * @property toolbarRightActions
       * @type Array
       * @final
       */
      toolbarRightActions: {
        value: []
      },

      /**
       * The list of right actions for the advanced toolbar.
       *
       * @property advancedToolbarRightActions
       * @type Array
       * @final
       */
      advancedToolbarRightActions: {
        value: []
      },

      /**
       * Languages actions for the advanced toolbar.
       *
       * @property advancedToolbarLanguageActions
       * @type Array
       * @final
       */
      advancedToolbarLanguageActions: {
        value: []
      },

      /**
       * Toolbar page info.
       *
       * Holds the configuration of the toolbar info action button which presents an information about the actual
       * page. Information message changes with the router page.
       *
       * @property toolbarPageInfo
       * @type Object
       * @final
       */
      toolbarPageInfo: {
        value: {
          type: 'info',
          message: null,
          accessibility: translateFilter('HEADER.INFO_ACCESSIBILITY'),
          help: translateFilter('HEADER.INFO_TOOLTIP')
        }
      },

      /**
       * Navigation menu for opa-nav component.
       *
       * @property navMenu
       * @type Array
       * @final
       */
      navMenu: {
        value: []
      },

      /**
       * Advanced navigation menu for opa-nav component.
       *
       * @property advancedNavMenu
       * @type Array
       * @final
       */
      advancedNavMenu: {
        value: []
      },

      /**
       * User's language.
       *
       * @property userLanguage
       * @type String
       * @final
       */
      userLanguage: {
        value: opaUserFactory.getLanguage() || opaI18nFactory.getLanguages()[0]
      },

      /**
       * Indicates if ng-view is loaded or not.
       *
       * true if view is loaded, false if it is currently loading.
       *
       * @property isViewLoaded
       * @type Boolean
       */
      isViewLoaded: {
        value: false,
        writable: true
      },

      /**
       * Initializes properties for sub components.
       *
       * @method init
       * @final
       */
      init: {
        value: function() {
          var navLanguagesActions = [];
          var navDashboardAction = {
            label: translateFilter('NAV.DASHBOARD'),
            icon: 'dashboard',
            action: ctrl.goTo,
            href: '/'
          };
          var navSettingsAction = {
            label: translateFilter('NAV.SETTINGS'),
            icon: 'settings',
            action: ctrl.goTo,
            href: '/settings'
          };
          var navPromotedVideosAction = {
            label: translateFilter('NAV.PROMOTED_VIDEOS'),
            icon: 'view_quilt',
            action: ctrl.goTo,
            href: '/promoted-videos'
          };

          opaI18nFactory.getLanguages().forEach(function(language) {
            ctrl.advancedToolbarLanguageActions.push({
              label: translateFilter('HEADER.LANGUAGES.' + language),
              accessibility: translateFilter('HEADER.LANGUAGES.' + language + '_ACCESSIBILITY'),
              code: language,
              action: ctrl.setLanguage,
              selected: language === ctrl.userLanguage
            });
            navLanguagesActions.push({
              label: translateFilter('NAV.LANGUAGES.' + language),
              code: language,
              action: ctrl.setLanguage,
              selected: language === ctrl.userLanguage
            });
          });

          ctrl.toolbarLeftActions.push(
            {
              type: 'icon',
              accessibility: translateFilter('HEADER.TOGGLE_MENU_ACCESSIBILITY'),
              help: translateFilter('HEADER.TOGGLE_MENU_TOOLTIP'),
              icon: 'menu',
              action: ctrl.toggleSideNavigation
            }
          );

          ctrl.toolbarRightActions.push(ctrl.toolbarPageInfo);

          ctrl.advancedToolbarRightActions.push(
            {
              type: 'icon',
              accessibility: translateFilter('HEADER.VIEW_PORTAL_ACCESSIBILITY'),
              help: translateFilter('HEADER.VIEW_PORTAL_TOOLTIP'),
              icon: 'visibility',
              action: ctrl.goToPortal
            },
            {
              type: 'list',
              accessibility: translateFilter('HEADER.TOGGLE_LANGUAGES_ACCESSIBILITY'),
              help: translateFilter('HEADER.TOGGLE_LANGUAGES_TOOLTIP'),
              icon: 'language',
              menu: ctrl.advancedToolbarLanguageActions
            },
            {
              type: 'list',
              accessibility: translateFilter('HEADER.TOGGLE_USER_ACTIONS_ACCESSIBILITY'),
              help: translateFilter('HEADER.TOGGLE_USER_ACTIONS_TOOLTIP'),
              icon: 'account_circle',
              menu: [
                {
                  label: translateFilter('HEADER.USER_ACTIONS.DISCONNECT'),
                  accessibility: translateFilter('HEADER.USER_ACTIONS.DISCONNECT_ACCESSIBILITY'),
                  action: ctrl.logout
                }
              ]
            }
          );

          ctrl.navMenu.push(navDashboardAction, navPromotedVideosAction, navSettingsAction);

          ctrl.advancedNavMenu.push(
            navDashboardAction,
            navPromotedVideosAction,
            navSettingsAction,
            {
              divider: true
            },
            {
              label: translateFilter('NAV.VIEW_PORTAL'),
              icon: 'visibility',
              action: ctrl.goToPortal
            },
            {
              label: translateFilter('NAV.LANGUAGE'),
              icon: 'language',
              actions: navLanguagesActions
            },
            {
              divider: true
            },
            {
              label: translateFilter('NAV.LOGOUT'),
              icon: 'power_settings_new',
              action: ctrl.logout
            }
          );
        }
      },

      /**
       * Logs out current user.
       *
       * @method logout
       * @final
       */
      logout: {
        value: function() {
          opaUserFactory.logout().then(function() {
            ctrl.goToPortal();
          });
        }
      },

      /**
       * Navigates to a back office page.
       *
       * @method goTo
       * @param {Object} item The menu item
       * @param {String} item.href The path to navigate to
       * @final
       */
      goTo: {
        value: function(item) {
          $location.path(item.href);
          ctrl.closeSideNavigation();
        }
      },

      /**
       * Navigates to the front office of the portal.
       *
       * @method goToPortal
       * @final
       */
      goToPortal: {
        value: function() {
          $window.location.href = '/';
        }
      },

      /**
       * Sets user's language.
       *
       * @method setLanguage
       * @param {Object} language A language description object
       * @param {String} language.code The language country code
       * @final
       */
      setLanguage: {
        value: function(language) {
          opaUserFactory.setLanguage(language.code);
          $window.location.href = '/be' + $location.path();
        }
      },

      /**
       * Closes side navigation.
       *
       * @method closeSideNavigation
       * @final
       */
      closeSideNavigation: {
        value: function() {
          $mdSidenav('opa').close();
        }
      },

      /**
       * Opens / closes side navigation.
       *
       * @method toggleSideNavigation
       * @final
       */
      toggleSideNavigation: {
        value: function() {
          $mdSidenav('opa').toggle();
        }
      },

      /**
       * Marks a menu item as selected.
       *
       * Both navigation menu and advanced navigation menu are updated.
       * The item with an "href" property corresponding to the given path will be selected,
       * selection on other items is removed.
       *
       * @method selectMenuItem
       * @final
       * @param {String} routePath The path of the item to select
       */
      selectMenuItem: {
        value: function(path) {
          var selectItem = function(navItem) {
            if (navItem.href === path)
              navItem.selected = true;
            else
              navItem.selected = false;
          };

          ctrl.navMenu.forEach(selectItem);
          ctrl.advancedNavMenu.forEach(selectItem);
        }
      }

    });

    // Listen to route change start event
    $scope.$on('$routeChangeStart', function(event, next) {
      ctrl.isViewLoaded = false;
      if (!opaUserFactory.isAuthenticated()) ctrl.goToPortal();
    });

    // Listen to route change success event
    $scope.$on('$routeChangeSuccess', function(event, route) {
      ctrl.page.title = route && route.title;
      ctrl.page.pageTitle = route && route.pageTitle;
      ctrl.toolbarPageInfo.message = (route && route.pageInfo) ? translateFilter(route.pageInfo) : null;
      ctrl.selectMenuItem(route.originalPath);
    });

    // Listen to view loaded event emitted by ng-views
    $scope.$on('opaViewLoaded', function() {
      ctrl.isViewLoaded = true;
    });

    // Listen to event informing about an HTTP error
    // On a not authenticated error log out the user
    // On other errors just inform the user by displaying a notification
    $scope.$on('opaHttpError', function(event, data) {
      if (data && data.authenticationError)
        ctrl.logout();
      else
        opaNotificationFactory.displayNotification(data.message, 0);
    });

    ctrl.init();
  }

  app.controller('OpaIndexController', OpaIndexController);
  OpaIndexController.$inject = [
    '$scope',
    '$route',
    '$window',
    '$location',
    '$filter',
    '$mdMedia',
    '$mdSidenav',
    'opaUserFactory',
    'opaI18nFactory',
    'opaNotificationFactory'
  ];

})(angular.module('opa'));
