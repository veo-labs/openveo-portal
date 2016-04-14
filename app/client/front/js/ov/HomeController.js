'use strict';

/**
 *
 * @param {type} app
 * @returns {undefined}
 */

(function(app) {

  /**
   * Defines the home page controller.
   */
  function HomeController($scope, $location, result) {
    $scope.videos = result && result.data ? result.data.videos : [];
    $scope.search = {query: ''};

    $scope.searchSubmit = function() {
      $location.path('/search').search($scope.search);
    };
  }

  app.controller('HomeController', HomeController);
  HomeController.$inject = ['$scope', '$location', 'result'];

})(angular.module('ov.portal'));
