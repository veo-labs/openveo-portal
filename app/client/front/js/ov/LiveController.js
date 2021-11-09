'use strict';

(function(app) {

  /**
   * Defines the live page controller.
   */
  function LiveController($scope, $filter, $sce) {
    var urlChunks;
    var player;

    $scope.live = openVeoPortalSettings.live;
    $scope.url = $sce.trustAsResourceUrl($scope.live.url);

    if ($scope.live.playerType === 'youtube') {
      urlChunks = $scope.live.url.match(/v=(.*)$/);
      $scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + urlChunks[1]);
    } else if ($scope.live.playerType === 'vimeo') {
      urlChunks = $scope.live.url.match(/event\/(.*)$/);
      $scope.url = $sce.trustAsResourceUrl('https://vimeo.com/event/' + urlChunks[1] + '/embed');
    } else if ($scope.live.playerType === 'vodalys') {
      urlChunks = $scope.live.url.match(/console\.vodalys\.studio\/(.*)$/);
      $scope.url = $sce.trustAsResourceUrl('https://console.vodalys.studio/' + urlChunks[1] + '#?embedded=true');
    } else if ($scope.live.playerType === 'wowza') {
      player = videojs('videojs-player', {
        autoplay: false,
        controls: true,
        sources: [{
          src: $scope.live.url + '?DVR',
          type: 'application/x-mpegURL'
        }],
        html5: {
          nativeControlsForTouch: false,
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        liveui: true,
        preload: 'auto'
      });
    }

    $scope.$on('$destroy', function() {
      if (player) player.dispose();
    });
  }

  app.controller('LiveController', LiveController);

  LiveController.$inject = ['$scope', '$filter', '$sce'];

})(angular.module('ov.portal'));
