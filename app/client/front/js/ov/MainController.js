'use strict';

(function(app) {

  /**
   * @param {type} $scope
   * @param {type} $mdDialog
   * @param {type} video
   * @returns {MainController_L3.DialogController}
   */
  function DialogController($scope, $mdDialog, video) {
    $scope.video = video;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
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
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
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
        return $mdMedia('xs') || $mdMedia('sm');
      });
    };
  }

  app.controller('MainController', MainController);
  MainController.$inject = ['$route', '$scope', 'links', '$mdDialog', '$mdMedia'];
  DialogController.$inject = ['$scope', '$mdDialog', 'video'];

})(angular.module('ov.portal'));
