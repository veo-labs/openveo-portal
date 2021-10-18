'use strict';

(function(app) {

  /**
   * Defines the home page controller.
   *
   * @param {Object} $scope
   * @param {Object} video
   */
  function VideoPageController($scope, video) {
    $scope.video = video.data.entity;
    $scope.playerType = $scope.video.type == 'youtube' ? 'youtube' : 'html';
  }

  app.controller('VideoPageController', VideoPageController);
  VideoPageController.$inject = ['$scope', 'video'];

})(angular.module('ov.portal'));
