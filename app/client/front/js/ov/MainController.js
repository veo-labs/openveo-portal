'use strict';

(function(app) {

  /**
   * @param {type} $scope
   * @param {type} $mdDialog
   * @param {type} video
   * @returns {MainController_L3.DialogController}
   */
  function DialogController($scope, $mdDialog, $locale, $timeout, video) {
    $scope.language = $locale.id;
    $scope.video = video;
    $scope.shareClosed = true;
    $scope.moreInfoClosed = true;

    var myPlayer = document.getElementById('openveo-player');
    var playerController;

    /**
     * Executes, safely, the given function in AngularJS process.
     *
     * @param {Function} functionToExecute The function to execute as part of
     * the angular digest process.
     */
    function safeApply(functionToExecute) {

      // Execute each apply on a different loop
      $timeout(function() {

        // Make sure we're not on a digestion cycle
        var phase = $scope.$root.$$phase;

        if (phase === '$apply' || phase === '$digest')
          functionToExecute();
        else
          $scope.$apply(functionToExecute);
      }, 1);
    }

    angular.element(myPlayer).on('durationChange', function(event, duration) {
      safeApply(function() {

        // only gets called once
        if (!playerController || duration) {
          playerController = angular.element(myPlayer).controller('ovPlayer');
        }
      });
    });

    // Listen to player errors
    // If an error occurs go back to catalog with an alert
    angular.element(myPlayer).on('error', function(event, error) {
      $scope.$emit('setAlert', 'danger', error.message, 8000);
    });

    $scope.hide = function() {
      $mdDialog.hide();
      $scope.shareClosed = true;
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
      $scope.shareClosed = true;
    };
    $scope.share = function(video) {
      $scope.shareClosed = !$scope.shareClosed;
      $scope.shareCode = '<iframe>' + video.title + '</iframne>';
    };
  }

  /**
   * Defines the main controller parent of all controllers in the
   * application. All actions not handled in partials are handled
   * by the main controller.
   */
  function MainController($route, $scope, links, $mdDialog, $mdMedia) {

    // Listen to route change success event to set new page title
    $scope.$on('$routeChangeSuccess', function(event, route) {

      // Change page title
      $scope.title = $route.current && $route.current.title || '';
      $scope.contactMailTo = links.contactMailTo;
      $scope.helpUrl = links.helpUrl;
    });

    $scope.openVideo = function(ev, video) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md') || $mdMedia('lg'));
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/dialogVideo.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: {
          video: video
        },
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      });

      $scope.$watch(function() {
        return ($mdMedia('sm') || $mdMedia('xs') || $mdMedia('md') || $mdMedia('lg'));
      });
    };
  }

  app.controller('MainController', MainController);
  app.controller('DialogController', DialogController);
  MainController.$inject = ['$route', '$scope', 'links', '$mdDialog', '$mdMedia'];
  DialogController.$inject = ['$scope', '$mdDialog', '$locale', '$timeout', 'video'];

})(angular.module('ov.portal'));
