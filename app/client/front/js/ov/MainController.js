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
    $scope.contactMailTo = links.contactMailTo;
    $scope.helpUrl = links.helpUrl;
    $scope.title = '';
    $scope.tabSelected = -1;

    // Listen to route change success event to set new page title
    $scope.$on('$routeChangeSuccess', function(event, route) {
      $analytics.pageTrack($location.path());
      $scope.title = $route.current && $route.current.title || $scope.title;
      switch (route.originalPath) {
        case '/search': $scope.tabSelected = 1; break;
        default: $scope.tabSelected = 0;
      }
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
        if (eventObj.status == '500')
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

          $scope.dialog.locals.video = result.data.entity.video;
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
        if (error.status == '500')
          $scope.showToast($filter('translate')('ERROR.SERVER'));
      });

      $scope.$watch(function() {
        return ($mdMedia('sm') || $mdMedia('xs'));
      }, function(wantsFullScreen) {
        $scope.dialogUseFullScreen = (wantsFullScreen === true);
      });
    };

    $scope.goTo = function(path) {
      $location.path(path).search({});
    };

    $scope.showToast = function(message) {
      var toast = $mdToast.simple()
        .textContent(message)
        .position('bottom left')
        .hideDelay(3000);
      $mdToast.show(toast);
    };
  }

  app.controller('MainController', MainController);
  app.controller('DialogController', DialogController);
  app.controller('ToastController', ToastController);
  MainController.$inject = ['$route', '$scope', 'links', '$mdDialog',
    '$mdToast', '$mdMedia', '$location', '$filter', 'searchService', '$analytics'];
  DialogController.$inject = ['$scope', '$mdDialog', 'video', '$mdMedia'];
  ToastController.$inject = ['$scope', '$mdToast'];

})(angular.module('ov.portal'));
