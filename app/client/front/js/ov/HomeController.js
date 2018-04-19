'use strict';

/**
 *
 * @param {type} app
 * @returns {undefined}
 */

(function(app) {

  /**
   * Defines the home page controller.
   *
   * @param {Object} promotedVideos Request results for promoted videos
   * @param {Object} promotedVideos.data Request data
   * @param {Array} promotedVideos.data.entities The list of promoted videos
   */
  function HomeController($scope, $location, promotedVideos) {
    if (promotedVideos && promotedVideos.data) {
      $scope.videos = promotedVideos.data.filter(function(promotedVideo) {
        return (promotedVideo);
      });
    } else
      $scope.videos = [];

    $scope.search = {};

    $scope.searchSubmit = function() {
      $location.path('/search').search($scope.search);
    };
  }

  app.controller('HomeController', HomeController);
  HomeController.$inject = ['$scope', '$location', 'promotedVideos'];

})(angular.module('ov.portal'));
