'use strict';

(function(app) {

  /**
   * Define toast controller for all toast in app
   * @param {type} $scope
   * @param {type} $mdToast
   * @returns {MainController_L3.ToastController}
   */
  function ToastController($scope, $mdToast) {
    $scope.closeToast = function() {
      $mdToast.hide();
    };
  }

  /**
   * Define dialog controller for all dialog in app
   * @param {type} $scope
   * @param {type} $mdDialog
   * @param {type} video
   * @returns {MainController_L3.DialogController}
   */
  function DialogController($scope, $mdDialog, video, $mdMedia) {

    $scope.video = video;
    $scope.dialogIsFull = ($mdMedia('sm') || $mdMedia('xs'));

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.$watch(function() {
      return ($mdMedia('sm') || $mdMedia('xs'));
    }, function(wantsFullScreen) {
      $scope.dialogIsFull = (wantsFullScreen === true);
    });
  }

  /**
   * Defines the main controller parent of all controllers in the
   * application. All actions not handled in partials are handled
   * by the main controller.
   */
  function MainController($route, $scope, links, $mdDialog, $mdToast, $mdMedia,
  $location, $filter, searchService, $analytics) {
    var urlParams = $location.search();
    $scope.context = {context: false};
    $scope.isIframe = urlParams['iframe'] || false;
    $scope.hideDetailVideo = urlParams['hidedetail'] || false;
    $scope.links = Object.keys(links).length === 0 && JSON.stringify(links) === JSON.stringify({}) ? null : links;
    $scope.title = '';
    $scope.path = '';

    // Listen to route change success event to set new page title
    $scope.$on('$routeChangeSuccess', function(event, route) {
      $scope.title = $route.current && $route.current.title || $scope.title;
      $scope.path = $location.path();
      $analytics.pageTrack($scope.path);
    });

    // Listen to the route change error event
    // If user is not authenticated, redirect to the login page
    // otherwise redirect to the home page
    $scope.$on('$routeChangeError', function(event, current, previous, eventObj) {
      if (eventObj && eventObj.redirect) {
        if (eventObj.redirect == '/authenticate')
          window.location.href = eventObj.redirect;
        else $location.path(eventObj.redirect);
      } else {
        $location.path('/');
        if (eventObj.status == '500' || eventObj.status == '502')
          $scope.showToast($filter('translate')('ERROR.SERVER'));
      }
    });

    $scope.openVideo = function(ev, video) {
      $scope.context.keepContext = false;
      var urlContext = $location.path();
      var searchContext = $location.search();

      $scope.dialogUseFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
      $scope.dialog = {
        controller: DialogController,
        templateUrl: 'views/dialogVideo.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          video: null
        },
        clickOutsideToClose: true,
        fullscreen: $scope.dialogUseFullScreen
      };

      searchService.loadVideo(video.id).then(function(result) {

        // video found and public or user authentified
        if (result.data.entity) {
          $location.path('/video/' + video.id, false).search({});

          $scope.dialog.locals.video = result.data.entity;
          $mdDialog.show($scope.dialog).finally(function() {
            $scope.context.keepContext = true;
            $location.path(urlContext, false).search(searchContext);
          });

          // user not authentified
        } else if (result.data.needAuth) {
          window.location.href = '/authenticate';
        } else $location.path('/');

      }, function(error) {

        // error on call
        searchService.cacheClear();
        $location.path('/');
        if (error.status == '500' || error.status == '502')
          $scope.showToast($filter('translate')('ERROR.SERVER'));
      });

      $scope.$watch(function() {
        return ($mdMedia('sm') || $mdMedia('xs'));
      }, function(wantsFullScreen) {
        $scope.dialogUseFullScreen = (wantsFullScreen === true);
      });
    };

    $scope.onTabSelected = function(path) {
      if (path == '/search')
        $location.path(path);
      else // reset search on home page
        $location.path(path).search({});
    };

    $scope.showToast = function(message) {
      var toast = $mdToast.simple()
        .textContent(message)
        .position('top center')
        .hideDelay(3000);
      $mdToast.show(toast);
    };
  }

  /**
   * Define placeholder directive on all video element
   */
  function ImageLoadedDirective($http) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        attrs.$observe('ngSrc', function(ngSrc) {
          $http.get(ngSrc).success(function() {

            // do nothing
          }).error(function() {
            element.attr('src', '/themes/' + scope.theme + '/images/placeholder.jpg'); // set default image
          });
        });
      }
    };
  }

  app.controller('MainController', MainController);
  app.controller('DialogController', DialogController);
  app.controller('ToastController', ToastController);
  MainController.$inject = ['$route', '$scope', 'links', '$mdDialog',
    '$mdToast', '$mdMedia', '$location', '$filter', 'searchService', '$analytics'];
  DialogController.$inject = ['$scope', '$mdDialog', 'video', '$mdMedia'];
  ToastController.$inject = ['$scope', '$mdToast'];

  ImageLoadedDirective.$inject = ['$http'];
  app.directive('checkImage', ImageLoadedDirective);

})(angular.module('ov.portal'));
