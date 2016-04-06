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
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.piwik',
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

      $routeProvider.when('/video/:mediaId', {
        templateUrl: 'views/videoPage.html',
        controller: 'VideoPageController',
        title: 'VIDEO.PAGE_TITLE',
        reloadOnSearch: false,
        resolve: {
          video: ['$q', 'searchService', '$route', function($q, searchService, $route) {
            var deferred = $q.defer();
            var mediaId = $route.current.params.mediaId;

            searchService.loadVideo(mediaId).then(function(result) {

              // video found and public or user authentified
              if (result.data.entity)
                deferred.resolve.apply(deferred, arguments);

              // user not authentified
              else if (result.data.needAuth)
                deferred.reject({redirect: '/authenticate'});

            }, function(error) {

              // error on call
              searchService.cacheClear();
              deferred.reject({redirect: '/'});
            });

            return deferred.promise;
          }]
        }
      });

      $routeProvider.when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchController',
        title: 'SEARCH.PAGE_TITLE',
        reloadOnSearch: false,
        resolve: {
          result: ['$location', 'searchService', function($location, searchService) {
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
          result: ['searchService', function(searchService) {
            return searchService.searchHomeVideos();
          }]
        }
      }).otherwise('/');

      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('errorInterceptor');

    }]);

})(angular);
