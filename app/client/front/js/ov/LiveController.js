'use strict';

(function(app) {

  /**
   * Defines the live page controller.
   */
  function LiveController($scope, $filter, $sce) {
    var urlChunks;
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
      var translateFilter = $filter('translate');

      WowzaPlayer.create(
        'wowza-player',
        {
          license: $scope.live.wowza.playerLicenseKey,
          sourceURL: $scope.live.url + '?DVR',
          autoPlay: true,
          volume: '100',
          mute: false,
          loop: false,
          audioOnly: false,
          uiShowQuickRewind: true,
          uiShowBitrateSelector: true,
          uiQuickRewindSeconds: '30',
          stringAuto: translateFilter('LIVE.WOWZA.AUTO'),
          stringBuffering: translateFilter('LIVE.WOWZA.BUFFERING'),
          stringCountdownTimerLabel: translateFilter('LIVE.WOWZA.COUNT_DOWN'),
          stringErrorStreamUnavailable: translateFilter('LIVE.WOWZA.STREAM_ERROR'),
          stringErrorCORSStreamUnavailable: translateFilter('LIVE.WOWZA.CORS_ERROR'),
          stringLiveLabel: translateFilter('LIVE.WOWZA.LIVE_BUTTON'),
          stringLiveEventEnded: translateFilter('LIVE.WOWZA.LIVE_ENDED'),
          stringLiveSeekAlt: translateFilter('LIVE.WOWZA.LIVE_BUTTON_OVER')
        }
      );
    }

  }

  app.controller('LiveController', LiveController);

  LiveController.$inject = ['$scope', '$filter', '$sce'];

})(angular.module('ov.portal'));
