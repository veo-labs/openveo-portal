'use strict';

(function(app) {

  /**
   * Defines the main controller parent of all controllers in the
   * application. All actions not handled in partials are handled
   * by the main controller.
   */
  function MainController($route, $scope) {

    // Listen to route change success event to set new page title
    $scope.$on('$routeChangeSuccess', function(event, route) {

      // Change page title
      $scope.title = $route.current && $route.current.title || '';

    });

  }

  app.controller('MainController', MainController);
  MainController.$inject = ['$route', '$scope'];

})(angular.module('ov.portal'));
