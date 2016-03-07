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
  function HomeController($scope, $location, videos) {
    $scope.videos = videos ? videos.data : [];
    $scope.search = {key: ''};

    $scope.searchSubmit = function() {
      $location.path('/videos').search($scope.search);
    };
  }

  app.controller('HomeController', HomeController);
  HomeController.$inject = ['$scope', '$location', 'videos'];

})(angular.module('ov.portal'));
