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
    'ngAnimate',
    'ngMaterial',
    'ngMessages',
    'ngSanitize',
    'ngCookies',
    'ov.locale',
    'ov.i18n',
    'ov.configuration',
    'ov.player'
  ];

  var app = angular.module('ov.portal', moduleDependencies);

  /**
   * Configures application main routes and set location mode to HTML5.
   */
  app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {

      $routeProvider.when('/videos', {
        templateUrl: 'views/videos.html',
        controller: 'VideosController',
        title: 'VIDEOS.PAGE_TITLE',
        reloadOnSearch: false,
        resolve: {
          videos: ['$location', 'searchService', function($location, searchService) {
            var param = $location.search();
            return searchService.search(param, null);
          }],
          filters: ['searchService', function(searchService) {
            return searchService.getFilters();
          }]
        }
      });

      // Register home page route
      $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        title: 'HOME.PAGE_TITLE',
        resolve: {
          videos: ['searchService', function(searchService) {
            return searchService.searchHomeVideos();
          }]
        }
      }).otherwise('/');

      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('errorInterceptor');

    }]);

})(angular);
