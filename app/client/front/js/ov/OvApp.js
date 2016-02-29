'use strict';

/**
 * Main OpenVeo Portal module.
 *
 * Initializes routes.
 *
 * @module ov.portal
 * @main ov.portal
 */

(function(angular) {

  var moduleDependencies = [
    'ngRoute',
    'ui.bootstrap',
    'ngTouch',
    'ngAnimate',
    'ov.locale',
    'ov.i18n',
    'ov.configuration'
  ];

  var app = angular.module('ov.portal', moduleDependencies);

  /**
   * Configures application main routes and set location mode to HTML5.
   */
  app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {

      // Register home page route
      $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        title: 'HOME.PAGE_TITLE'
      }).otherwise('/');

      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('errorInterceptor');

    }]);

})(angular);
