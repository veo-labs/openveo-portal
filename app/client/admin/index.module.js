'use strict';

/**
 * OpenVeo Portal AngularJS module to manage administration interface.
 *
 * opa (for OpenVeo Portal Admin) module holds all components of the OpenVeo Portal administration interface.
 * It also defines opaWebServiceBasePath constant holding the base path of the Web Service.
 *
 * @module opa
 * @main opa
 */

(function(angular) {

  /**
   * Main module of the OpenVeo Portal administration interface.
   *
   * Requires:
   * - **ngRoute** AngularJS route module
   * - **ngAnimate** AngularJS animate module
   * - **ngAria** AngularJS ARIA module
   * - **ngCookies** AngularJS Cookies module
   * - **ngMessages** AngularJS Messages module
   * - **ngMaterial** AngularJS Material module
   * - **opa.i18n** OpenVeo Portal internationalization module
   * - **opa.locale** OpenVeo Portal translations
   */
  var app = angular.module('opa', [
    'ngRoute',
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'opa.i18n',
    'opa.locale'
  ]);

  app.constant('opaWebServiceBasePath', '/ws/');

  app.config(['$routeProvider', '$locationProvider', '$logProvider', '$httpProvider', '$mdThemingProvider',
    function($routeProvider, $locationProvider, $logProvider, $httpProvider, $mdThemingProvider) {

      // Register dashboard page route
      $routeProvider.when('/', {
        template: '<opa-dashboard flex layout="row"></opa-dashboard>',
        pageTitle: 'DASHBOARD.PAGE_TITLE',
        title: 'DASHBOARD.TITLE',
        pageInfo: 'DASHBOARD.INFO'
      }).otherwise('/');

      // Register "Promoted videos" page route
      $routeProvider.when('/promoted-videos', {
        template: '<opa-promoted-videos flex layout="row"></opa-promoted-videos>',
        pageTitle: 'PROMOTED_VIDEOS.PAGE_TITLE',
        title: 'PROMOTED_VIDEOS.TITLE',
        pageInfo: 'PROMOTED_VIDEOS.INFO'
      });

      // Register settings page route
      $routeProvider.when('/settings', {
        template: '<opa-settings flex layout="row"></opa-settings>',
        pageTitle: 'SETTINGS.PAGE_TITLE',
        title: 'SETTINGS.TITLE',
        pageInfo: 'SETTINGS.INFO'
      });

      $locationProvider.html5Mode(true);
      $logProvider.debugEnabled(false);
      $httpProvider.interceptors.push('opaInterceptor');

      // OpenVeo Portal Admin blue
      $mdThemingProvider.definePalette('opaBlue', {
        50: 'f5f8ff',
        100: 'e5eeff',
        200: 'bde1f5',
        300: '7ec2e7',
        400: '58b3e4',
        500: '1a91d1',
        600: '1a8dcb',
        700: '1f7bad',
        800: '1a6c99',
        900: '155d84',
        A100: '80d2ff',
        A200: '52c2ff',
        A400: '1aafff',
        A700: '008bd6',
        contrastDefaultColor: 'dark',
        contrastLightColors: ['500', '700', '800', '900']
      });

      // OpenVeo Portal Admin pink
      $mdThemingProvider.definePalette('opaPink', {
        50: 'fff5fe',
        100: 'ffe5eb',
        200: 'f5bddc',
        300: 'e77eb8',
        400: 'e458a5',
        500: 'e6007e',
        600: 'cb1a7c',
        700: 'ad1f6d',
        800: '991a60',
        900: '841552',
        A100: 'ff80c6',
        A200: 'ff52b1',
        A400: 'ff1a98',
        A700: 'd60076',
        contrastDefaultColor: 'dark',
        contrastLightColors: ['500', '600', '700', '800', '900', 'A700']
      });

      $mdThemingProvider.theme('default').primaryPalette('opaBlue', {
        default: '500',
        'hue-1': '300',
        'hue-2': '800',
        'hue-3': 'A100'
      });
      $mdThemingProvider.theme('default').accentPalette('opaPink', {
        default: 'A200',
        'hue-1': 'A100',
        'hue-2': 'A400',
        'hue-3': 'A700'
      });

    }]);

  app.run([
    '$filter',
    'opaInfoConfiguration',
    'opaNotificationConfiguration',
    function($filter, opaInfoConfiguration, opaNotificationConfiguration) {
      opaInfoConfiguration.setOptions({
        closeLabel: $filter('opaTranslate')('INFO.CLOSE'),
        closeAriaLabel: $filter('opaTranslate')('INFO.CLOSE_ACCESSIBILITY')
      });

      opaNotificationConfiguration.setOptions({
        closeLabel: $filter('opaTranslate')('NOTIFICATION.CLOSE'),
        closeAriaLabel: $filter('opaTranslate')('NOTIFICATION.CLOSE_ACCESSIBILITY')
      });
    }
  ]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['opa'], {strictDi: true});
  });

})(angular);
