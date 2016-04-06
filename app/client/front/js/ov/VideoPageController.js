'use strict';

(function(app) {

  /**
   *
   * @param {type} $scope
   * @param {type} video
   * @returns {VideoPageController_L3.VideoPageController}
   */
  function VideoPageController($scope, video) {
    $scope.video = video.data.entity.video;
  }

  app.controller('VideoPageController', VideoPageController);
  VideoPageController.$inject = ['$scope', 'video'];

})(angular.module('ov.portal'));
