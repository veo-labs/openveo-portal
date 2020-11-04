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
    'angulartics.piwik',
    'ov.locale',
    'ov.i18n',
    'ov.configuration',
    'ov.player',
    'ov.authentication',
    'ov.storage'
  ];

  var app = angular.module('ov.portal', moduleDependencies);

  app.constant('webServiceBasePath', '/ws/');

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
        var month = dateObj.getMonth() + 1;
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

      // Register video page route
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
                  deferred.reject({redirect: '/login', needAuth: true});

                else deferred.reject({redirect: '/'});

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

      // Register search page route
      $routeProvider.when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchController',
        title: 'SEARCH.PAGE_TITLE',
        reloadOnSearch: false,
        resolve: {
          filters: ['searchService', function(searchService) {
            return searchService.getFilters();
          }]
        }
      });

      // Register live page route
      if (openVeoPortalSettings.live.activated) {
        $routeProvider.when('/live-event', {
          templateUrl: 'views/live.html',
          controller: 'LiveController',
          title: 'LIVE.PAGE_TITLE'
        });
      }

      // Register login page route
      $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginFormController',
        controllerAs: 'loginCtrl',
        title: 'LOGIN.PAGE_TITLE'
      });

      // Register home page route
      $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        title: 'HOME.PAGE_TITLE',
        resolve: {
          promotedVideos: ['searchService', function(searchService) {
            return searchService.getPromotedVideos();
          }]
        }
      }).otherwise('/');

      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('errorInterceptor');

    }]);

})(angular);
