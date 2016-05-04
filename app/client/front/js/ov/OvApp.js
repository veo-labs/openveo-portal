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

  // Redefine path to not reload when modify is change
  app.run(['$route', '$rootScope', '$location', function($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function(path, reload) {
      if (reload === false) {
        var lastRoute = $route.current;
        var un = $rootScope.$on('$locationChangeSuccess', function() {
          $route.current = lastRoute;
          un();
        });
      }
      return original.apply($location, [path]);
    };
  }]);

  app.config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
    var locale = angular.injector(['ng']).get('$locale').id.slice(0, 2);
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.parseDate = function(dateString) {
      var dateParts = dateString.split('/');
      if (locale == 'fr') return new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
      else return new Date(dateParts[2], (dateParts[0] - 1), dateParts[1]);
    };
    $mdDateLocaleProvider.formatDate = function(date) {
      if (date) {
        var dateObj = new Date(date);
        var day = dateObj.getDate();
        var month = dateObj.getMonth();
        var year = dateObj.getFullYear();
        if (locale == 'fr') return day + '/' + month + '/' + year;
        else return month + '/' + day + '/' + year;
      } else return '';
    };
  }]);

  /**
   * Configures application main routes and set location mode to HTML5.
   */
  app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {

      $routeProvider.when('/video/:mediaId', {
        templateUrl: 'views/videoPage.html',
        controller: 'VideoPageController',
        title: 'VIDEO.PAGE_TITLE',
        resolve: {
          video: ['$q', 'searchService', '$route', function($q, searchService, $route) {
            var deferred = $q.defer();
            var mediaId = $route.current.params.mediaId;
            if (mediaId)
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
            else {
              deferred.reject({redirect: '/'});
            }

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
            var param = angular.copy($location.search());
            param.sortBy = param.sortBy ? 'views' : 'date';
            param.sortOrder = param.sortOrder ? 'asc' : 'desc';
            return searchService.search(param, {});
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
